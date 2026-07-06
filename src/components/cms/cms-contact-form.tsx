"use client";

import { useState, type FormEvent } from "react";
import type { CmsContactFormBlock } from "@/lib/cms/types";
import { sansBold, sansLight } from "@/lib/typography";

type Props = Pick<CmsContactFormBlock, "submitLabel" | "successMessage">;

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function CmsContactForm({
  submitLabel = "Send message",
  successMessage = "Message sent — I'll get back to you soon.",
}: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage("Could not send your message. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="cms-contact-name" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
            Name
          </label>
          <input
            id="cms-contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="cms-contact-email" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
            Email
          </label>
          <input
            id="cms-contact-email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="cms-contact-message" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
          Message
        </label>
        <textarea
          id="cms-contact-message"
          name="message"
          rows={5}
          required
          placeholder="Tell me about your project…"
          className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors resize-none"
        />
      </div>

      {status === "success" ? <p className="text-sm text-foreground">{successMessage}</p> : null}
      {status === "error" ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={`self-start px-6 py-3 rounded-full bg-foreground text-background text-sm hover:opacity-80 transition-opacity disabled:opacity-50 ${sansBold}`}
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
