"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, BatteryCharging, ChevronDown, MessageCircleQuestion, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { StatusBanner, SubmitButton, inputClass, labelClass } from "@/components/FormControls";

const categories = [
  {
    id: "charging",
    title: "Charging & Range",
    icon: BatteryCharging,
    items: [
      {
        q: "Can I charge a Linktour L6 or L7 at home?",
        a: "Yes — both models are designed to charge from a standard household wall outlet, so no dedicated wallbox is required. A wallbox can still be added later for faster charging.",
      },
      {
        q: "How long does a full charge take?",
        a: "The L6's 7.2 kWh battery charges from 0 to 100% in about 4 hours at 2 kW. The L7's larger 12.96 kWh battery takes about 4.5 hours at 3.3 kW. Both use AC charging.",
      },
      {
        q: "What's the driving range on a single charge?",
        a: "The L6 covers up to 120 km and the L7 up to 180 km on a full charge (WMTC test cycle). Real-world range varies with speed, temperature, and load.",
      },
    ],
  },
  {
    id: "licensing",
    title: "Licensing & Quadricycles",
    icon: BadgeCheck,
    items: [
      {
        q: "What's the difference between the L6 and L7 classification?",
        a: "The L6 is registered as an L6e light quadricycle and the L7 as an L7e heavy quadricycle — official EU vehicle categories with different weight, power, and speed limits. L7e permits higher performance than L6e.",
      },
      {
        q: "Do I need a special driver's license?",
        a: "License requirements for L6e/L7e vehicles depend on your existing license and local rules in North Macedonia. Contact our specialist team to confirm exactly what applies to you before you order.",
      },
      {
        q: "Are there speed limits for these vehicles?",
        a: "Yes. The L6 has a top speed of 45 km/h, the limit for the L6e light quadricycle category. The L7 reaches 90 km/h.",
      },
    ],
  },
  {
    id: "service",
    title: "Local Service & Warranty",
    icon: Wrench,
    items: [
      {
        q: "Who handles service and warranty in North Macedonia?",
        a: "AVC-SM CO., LTD., with 24+ years of experience in electric mobility, batteries, and electronics, provides local warranty support, battery diagnostics, cell balancing, and repair — backed by official parts through our partnership with Linktour.",
      },
      {
        q: "What happens if something goes wrong with the battery?",
        a: "AVC-SM's technical team has specialized equipment and trained personnel for battery diagnostics, testing, balancing, and repair, so battery issues are handled locally rather than requiring you to ship the vehicle abroad.",
      },
      {
        q: "How does import and delivery work?",
        a: "BetaSped, our logistics partner with 30+ years in freight forwarding, handles import, customs, and delivery — so every vehicle arrives through an established, professional supply chain.",
      },
    ],
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-silver/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-slate-50 transition-colors hover:text-teal"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-teal transition-transform ${isOpen ? "rotate-180" : ""}`}
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
            <p className="pb-4 text-sm text-silver">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecialistForm() {
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
      setErrorMessage("Something went wrong — please try again in a moment.");
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <StatusBanner
        status="success"
        successMessage="Thanks! A specialist will get back to you shortly."
      />
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
        Message
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className={inputClass}
          placeholder="Ask us anything about the L6, L7, charging, or licensing…"
        />
      </label>

      <SubmitButton status={status}>Send to a Specialist</SubmitButton>
    </form>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="faq" className="border-t border-silver/10">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-silver">
            Answers to the questions we hear most about charging, licensing, and local support.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <category.icon className="h-5 w-5 text-teal" />
                <h3 className="text-lg font-semibold text-slate-50">{category.title}</h3>
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
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 rounded-2xl border border-teal/30 bg-white/[0.03] p-6 shadow-[0_0_60px_-25px_var(--color-teal)] sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
              <MessageCircleQuestion className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-slate-50">Ask a Specialist</h3>
              <p className="text-sm text-silver">
                Don&apos;t see your question? Send it directly to our team.
              </p>
            </div>
          </div>
          <SpecialistForm />
        </motion.div>
      </div>
    </section>
  );
}
