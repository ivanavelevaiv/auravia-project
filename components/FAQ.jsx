"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, BatteryCharging, ChevronDown, MessageCircleQuestion, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { StatusBanner, SubmitButton, inputClass, labelClass } from "@/components/FormControls";

// Category titles and Q&A copy are localized in dict.faq.categories; icons are keyed by id.
const categoryIcons = {
  charging: BatteryCharging,
  licensing: BadgeCheck,
  service: Wrench,
};

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-silver/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-ink transition-colors hover:text-accent"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-accent transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecialistForm({ dict, common }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("inquiries").insert([
      { ...form, inquiry_type: "FAQ - Ask a Specialist" },
    ]);

    if (error) {
      setStatus("error");
      setErrorMessage(common.genericError);
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <StatusBanner
        status="success"
        successMessage={dict.success}
      />
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
        {dict.message}
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className={inputClass}
          placeholder={dict.messagePlaceholder}
        />
      </label>

      <SubmitButton status={status} submittingLabel={common.submitting}>
        {dict.submit}
      </SubmitButton>
    </form>
  );
}

export default function FAQ({ dict, common }) {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="faq" className="border-t border-silver/10">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{dict.heading}</h2>
          <p className="text-muted">{dict.description}</p>
        </div>

        <div className="flex flex-col gap-10">
          {dict.categories.map((category) => {
            const CategoryIcon = categoryIcons[category.id];
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <CategoryIcon className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-ink">{category.title}</h3>
                </div>
                <div>
                  {category.items.map((item, index) => {
                    const key = `${category.id}-${index}`;
                    return (
                      <AccordionItem
                        key={key}
                        question={item.q}
                        answer={item.a}
                        isOpen={Boolean(openItems[key])}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 rounded-2xl border border-teal/30 bg-ink/[0.03] p-6 shadow-[0_0_60px_-25px_var(--color-teal)] sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-accent">
              <MessageCircleQuestion className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-ink">{dict.specialist.title}</h3>
              <p className="text-sm text-muted">{dict.specialist.subtitle}</p>
            </div>
          </div>
          <SpecialistForm dict={dict.specialist} common={common} />
        </motion.div>
      </div>
    </section>
  );
}
