"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, PackageSearch, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useBookingModal } from "@/lib/bookingModalContext";
import {
  FieldError,
  StatusBanner,
  SubmitButton,
  checkDateInRange,
  formatDisplayDate,
  getDateRange,
  inputClass,
  labelClass,
  selectClass,
} from "@/components/FormControls";
import DatePicker from "@/components/DatePicker";
import CityField from "@/components/CityField";
import { format } from "@/lib/i18n";

// Option values are what gets stored in Supabase, so they stay in English regardless of
// locale; only the visible labels come from the dictionary.
const TIME_SLOTS = [
  { value: "Morning (9:00 – 12:00)", key: "morning" },
  { value: "Afternoon (12:00 – 15:00)", key: "afternoon" },
  { value: "Late Afternoon (15:00 – 18:00)", key: "lateAfternoon" },
];

const CUSTOMER_TYPES = [
  { value: "Private", key: "private" },
  { value: "Young Driver", key: "youngDriver" },
  { value: "Business/Fleet", key: "business" },
];

// Test drives can be booked from today up to this many months ahead.
const BOOKING_WINDOW_MONTHS = 3;

function TestDriveForm({ prefill, onDone, dict, common }) {
  // Fixed when the form opens, in the visitor's local time zone.
  const [dateRange] = useState(() => getDateRange(BOOKING_WINDOW_MONTHS));
  const [dateError, setDateError] = useState("");
  const dateId = useId();
  const dateHintId = useId();
  const dateErrorId = useId();
  const dateTriggerRef = useRef(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    model_preference: prefill.model === "L6" || prefill.model === "L7" ? prefill.model : "Both",
    preferred_date: "",
    preferred_time_slot: TIME_SLOTS[0].value,
    customer_type: "Private",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const displayRange = {
    min: formatDisplayDate(dateRange.min),
    max: formatDisplayDate(dateRange.max),
  };

  // The calendar only offers days inside the range, so this is a safety net.
  const handleDateChange = (iso) => {
    setForm((prev) => ({ ...prev, preferred_date: iso }));
    const problem = checkDateInRange(iso, dateRange);
    setDateError(problem ? format(dict.dateErrors[problem], displayRange) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // The date is a button-driven calendar, not a native input, so `required` can't cover it.
    const problem = form.preferred_date
      ? checkDateInRange(form.preferred_date, dateRange)
      : "required";
    if (problem) {
      setDateError(format(dict.dateErrors[problem], displayRange));
      dateTriggerRef.current?.focus();
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("test_drives").insert([form]);

    if (error) {
      setStatus("error");
      setErrorMessage(common.genericError);
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner
          status="success"
          successMessage={dict.testDriveSuccess}
        />
        <button
          type="button"
          onClick={onDone}
          className="inline-flex w-full items-center justify-center rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent"
        >
          {common.done}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <StatusBanner status={status} errorMessage={errorMessage} />

      <label className={labelClass}>
        {common.fullName}
        <input
          required
          type="text"
          value={form.full_name}
          onChange={update("full_name")}
          className={inputClass}
          placeholder={common.namePlaceholder}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {common.email}
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder={common.emailPlaceholder}
          />
        </label>
        <label className={labelClass}>
          {common.phone}
          <input
            required
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className={inputClass}
            placeholder="+389 70 000 000"
          />
        </label>
      </div>

      <label className={labelClass}>
        {dict.modelPreference}
        <select
          required
          value={form.model_preference}
          onChange={update("model_preference")}
          className={selectClass}
        >
          <option value="L6">Linktour L6</option>
          <option value="L7">Linktour L7</option>
          <option value="Both">{dict.modelBoth}</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* A div, not a <label> wrapper: the calendar has its own buttons, and a wrapping label
            would forward clicks on them to the trigger. */}
        <div className={labelClass}>
          <label htmlFor={dateId}>{dict.preferredDate}</label>
          <DatePicker
            ref={dateTriggerRef}
            id={dateId}
            value={form.preferred_date}
            onChange={handleDateChange}
            min={dateRange.min}
            max={dateRange.max}
            labels={dict.calendar}
            invalid={Boolean(dateError)}
            describedBy={dateError ? dateErrorId : dateHintId}
          />
          {dateError ? (
            <FieldError id={dateErrorId}>{dateError}</FieldError>
          ) : (
            <span id={dateHintId} className="text-xs text-muted/70">
              {format(dict.dateHint, displayRange)}
            </span>
          )}
        </div>
        <label className={labelClass}>
          {dict.timeSlot}
          <select
            required
            value={form.preferred_time_slot}
            onChange={update("preferred_time_slot")}
            className={selectClass}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {dict.timeSlots[slot.key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        {dict.customerType}
        <select
          required
          value={form.customer_type}
          onChange={update("customer_type")}
          className={selectClass}
        >
          {CUSTOMER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {dict.customerTypes[type.key]}
            </option>
          ))}
        </select>
      </label>

      <SubmitButton status={status} submittingLabel={common.submitting}>
        {common.bookTestDrive}
      </SubmitButton>
    </form>
  );
}

const modelFromPrefill = (prefill) =>
  prefill.model === "L6" || prefill.model === "L7" ? prefill.model : "L6";

// "Check Availability" collects no contact details and saves nothing: stock is confirmed by the
// team, so the result explains that and hands off to the waitlist or a test drive (prefilled with
// the chosen model) for anyone who wants a reply.
function AvailabilityForm({ prefill, dict, common, locale, openModal }) {
  const [city, setCity] = useState("");
  const [model, setModel] = useState(() => modelFromPrefill(prefill));
  const [color, setColor] = useState("");
  const [checked, setChecked] = useState(false);

  const cityName = city.trim();
  const modelLabel = `Linktour ${model}${color.trim() ? ` (${color.trim()})` : ""}`;

  if (checked) {
    const message = cityName
      ? format(dict.availabilityResultCity, { model: modelLabel, city: cityName })
      : format(dict.availabilityResultAnywhere, { model: modelLabel });
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner status="success" successMessage={message} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openModal("waitlist", { model })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02]"
          >
            <Users className="h-4 w-4" />
            {dict.titles.waitlist}
          </button>
          <button
            type="button"
            onClick={() => openModal("test-drive", { model })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent"
          >
            <CalendarCheck className="h-4 w-4" />
            {dict.titles["test-drive"]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(true);
      }}
      className="flex flex-col gap-4"
    >
      <p className="-mt-2 text-sm text-muted">{dict.availabilityIntro}</p>

      <CityField value={city} onChange={setCity} locale={locale} labels={dict.availabilityLocation} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {dict.modelInterest}
          <select required value={model} onChange={(event) => setModel(event.target.value)} className={selectClass}>
            <option value="L6">Linktour L6</option>
            <option value="L7">Linktour L7</option>
          </select>
        </label>
        <label className={labelClass}>
          {dict.colorPreference}
          <input
            type="text"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className={inputClass}
            placeholder={dict.colorPlaceholder}
          />
        </label>
      </div>

      <SubmitButton status="idle">
        {cityName
          ? format(dict.availabilityLocation.submitIn, { city: cityName })
          : common.checkAvailability}
      </SubmitButton>
    </form>
  );
}

function WaitlistForm({ intent, prefill, onDone, dict, common }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    model_interest: modelFromPrefill(prefill),
    color_preference: "",
    intent_type: intent,
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("waitlist").insert([
      {
        ...form,
        color_preference: form.color_preference.trim() || null,
      },
    ]);

    if (error) {
      setStatus("error");
      setErrorMessage(common.genericError);
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    const successMessage =
      form.intent_type === "Pre-Order Deposit" ? dict.preorderSuccess : dict.waitlistSuccess;
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner status="success" successMessage={successMessage} />
        <button
          type="button"
          onClick={onDone}
          className="inline-flex w-full items-center justify-center rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent"
        >
          {common.done}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <StatusBanner status={status} errorMessage={errorMessage} />

      <label className={labelClass}>
        {common.fullName}
        <input
          required
          type="text"
          value={form.full_name}
          onChange={update("full_name")}
          className={inputClass}
          placeholder={common.namePlaceholder}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {common.email}
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder={common.emailPlaceholder}
          />
        </label>
        <label className={labelClass}>
          {common.phone}
          <input
            required
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className={inputClass}
            placeholder="+389 70 000 000"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {dict.modelInterest}
          <select
            required
            value={form.model_interest}
            onChange={update("model_interest")}
            className={selectClass}
          >
            <option value="L6">Linktour L6</option>
            <option value="L7">Linktour L7</option>
          </select>
        </label>
        <label className={labelClass}>
          {dict.colorPreference}
          <input
            type="text"
            value={form.color_preference}
            onChange={update("color_preference")}
            className={inputClass}
            placeholder={dict.colorPlaceholder}
          />
        </label>
      </div>

      <label className={labelClass}>
        {dict.intentLabel}
        <select
          required
          value={form.intent_type}
          onChange={update("intent_type")}
          className={selectClass}
        >
          <option value="Waitlist">{dict.intents.waitlist}</option>
          <option value="Pre-Order Deposit">{dict.intents.preorder}</option>
        </select>
      </label>

      <SubmitButton status={status} submittingLabel={common.submitting}>
        {form.intent_type === "Pre-Order Deposit" ? common.reserve : dict.submitWaitlist}
      </SubmitButton>
    </form>
  );
}

// Titles are localized in dict.booking.titles, keyed by modal type.
const MODAL_ICONS = {
  "test-drive": CalendarCheck,
  availability: PackageSearch,
  waitlist: Users,
  reserve: Users,
};

export default function BookingModal({ dict, common, locale }) {
  const { type, prefill, openModal, closeModal } = useBookingModal();
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!type) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [type, closeModal]);

  const Icon = type ? MODAL_ICONS[type] : null;

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-page/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-teal/30 bg-page p-6 shadow-[0_0_60px_-15px_var(--color-teal)] sm:p-8"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label={common.close}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-silver/30 text-ink transition-colors hover:border-teal hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-accent">
                {Icon && <Icon className="h-5 w-5" />}
              </span>
              <h2 id={titleId} className="text-xl font-semibold text-ink">
                {type ? dict.titles[type] : null}
              </h2>
            </div>

            {type === "test-drive" && (
              <TestDriveForm prefill={prefill} onDone={closeModal} dict={dict} common={common} />
            )}
            {type === "availability" && (
              <AvailabilityForm
                prefill={prefill}
                dict={dict}
                common={common}
                locale={locale}
                openModal={openModal}
              />
            )}
            {type === "waitlist" && (
              <WaitlistForm
                intent="Waitlist"
                prefill={prefill}
                onDone={closeModal}
                dict={dict}
                common={common}
              />
            )}
            {type === "reserve" && (
              <WaitlistForm
                intent="Pre-Order Deposit"
                prefill={prefill}
                onDone={closeModal}
                dict={dict}
                common={common}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
