"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useBookingModal } from "@/lib/bookingModalContext";
import { StatusBanner, SubmitButton, inputClass, labelClass } from "@/components/FormControls";

const TIME_SLOTS = [
  "Morning (9:00 – 12:00)",
  "Afternoon (12:00 – 15:00)",
  "Late Afternoon (15:00 – 18:00)",
];

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

function TestDriveForm({ prefill, onDone }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    model_preference: prefill.model === "L6" || prefill.model === "L7" ? prefill.model : "Both",
    preferred_date: "",
    preferred_time_slot: TIME_SLOTS[0],
    customer_type: "Private",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("test_drives").insert([form]);

    if (error) {
      setStatus("error");
      setErrorMessage("Something went wrong — please try again in a moment.");
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner
          status="success"
          successMessage="You're booked! We'll confirm your test drive by email or phone shortly."
        />
        <button
          type="button"
          onClick={onDone}
          className="inline-flex w-full items-center justify-center rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <StatusBanner status={status} errorMessage={errorMessage} />

      <label className={labelClass}>
        Full name
        <input
          required
          type="text"
          value={form.full_name}
          onChange={update("full_name")}
          className={inputClass}
          placeholder="Jane Petrovska"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder="jane@example.com"
          />
        </label>
        <label className={labelClass}>
          Phone
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
        Model preference
        <select
          required
          value={form.model_preference}
          onChange={update("model_preference")}
          className={inputClass}
        >
          <option value="L6">Linktour L6</option>
          <option value="L7">Linktour L7</option>
          <option value="Both">Both — not sure yet</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Preferred date
          <input
            required
            type="date"
            min={todayISODate()}
            value={form.preferred_date}
            onChange={update("preferred_date")}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Time slot
          <select
            required
            value={form.preferred_time_slot}
            onChange={update("preferred_time_slot")}
            className={inputClass}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Customer type
        <select
          required
          value={form.customer_type}
          onChange={update("customer_type")}
          className={inputClass}
        >
          <option value="Private">Private buyer</option>
          <option value="Young Driver">Young driver / first car</option>
          <option value="Business/Fleet">Business / fleet</option>
        </select>
      </label>

      <SubmitButton status={status}>Book Test Drive</SubmitButton>
    </form>
  );
}

function WaitlistForm({ intent, prefill, onDone }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    model_interest: prefill.model === "L6" || prefill.model === "L7" ? prefill.model : "L6",
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
      setErrorMessage("Something went wrong — please try again in a moment.");
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    const successMessage =
      form.intent_type === "Pre-Order Deposit"
        ? "Thanks! We'll be in touch about your pre-order deposit."
        : "You're on the waitlist! We'll email you as soon as a unit is available.";
    return (
      <div className="flex flex-col gap-4">
        <StatusBanner status="success" successMessage={successMessage} />
        <button
          type="button"
          onClick={onDone}
          className="inline-flex w-full items-center justify-center rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <StatusBanner status={status} errorMessage={errorMessage} />

      <label className={labelClass}>
        Full name
        <input
          required
          type="text"
          value={form.full_name}
          onChange={update("full_name")}
          className={inputClass}
          placeholder="Jane Petrovska"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder="jane@example.com"
          />
        </label>
        <label className={labelClass}>
          Phone
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
          Model interest
          <select
            required
            value={form.model_interest}
            onChange={update("model_interest")}
            className={inputClass}
          >
            <option value="L6">Linktour L6</option>
            <option value="L7">Linktour L7</option>
          </select>
        </label>
        <label className={labelClass}>
          Color preference
          <input
            type="text"
            value={form.color_preference}
            onChange={update("color_preference")}
            className={inputClass}
            placeholder="e.g. White (optional)"
          />
        </label>
      </div>

      <label className={labelClass}>
        I&apos;d like to
        <select
          required
          value={form.intent_type}
          onChange={update("intent_type")}
          className={inputClass}
        >
          <option value="Waitlist">Join the waitlist</option>
          <option value="Pre-Order Deposit">Place a pre-order deposit</option>
        </select>
      </label>

      <SubmitButton status={status}>
        {form.intent_type === "Pre-Order Deposit" ? "Reserve / Pre-Order" : "Join Waitlist"}
      </SubmitButton>
    </form>
  );
}

const MODAL_CONFIG = {
  "test-drive": { title: "Book a Test Drive", icon: CalendarCheck },
  waitlist: { title: "Join the Waitlist", icon: Users },
  reserve: { title: "Reserve / Pre-Order", icon: Users },
};

export default function BookingModal() {
  const { type, prefill, closeModal } = useBookingModal();
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

  const config = type ? MODAL_CONFIG[type] : null;
  const Icon = config?.icon;

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-obsidian/80 p-4 backdrop-blur-sm"
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
            className="relative w-full max-w-lg rounded-2xl border border-teal/30 bg-obsidian p-6 shadow-[0_0_60px_-15px_var(--color-teal)] sm:p-8"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-silver/30 text-slate-100 transition-colors hover:border-teal hover:text-teal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                {Icon && <Icon className="h-5 w-5" />}
              </span>
              <h2 id={titleId} className="text-xl font-semibold text-slate-50">
                {config?.title}
              </h2>
            </div>

            {type === "test-drive" && <TestDriveForm prefill={prefill} onDone={closeModal} />}
            {type === "waitlist" && (
              <WaitlistForm intent="Waitlist" prefill={prefill} onDone={closeModal} />
            )}
            {type === "reserve" && (
              <WaitlistForm intent="Pre-Order Deposit" prefill={prefill} onDone={closeModal} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
