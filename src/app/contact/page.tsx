"use client";

import { useState, type FormEvent } from "react";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getContactPhoneHref,
  SOCIAL_LINKS,
} from "@/lib/site-config";
import { decoMedium, sansBold, sansLight, sansMedium } from "@/lib/typography";

function socialDisplay(href: string, id: string): string {
  if (id === "x") {
    const handle = href.match(/x\.com\/([^/?]+)/)?.[1];
    return handle ? `@${handle}` : href;
  }
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return `${host}${path}`;
  } catch {
    return href;
  }
}

const ELSEWHERE_LINKS = [
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, display: CONTACT_EMAIL },
  { label: "Phone", href: getContactPhoneHref(), display: CONTACT_PHONE },
  ...SOCIAL_LINKS.map((social) => ({
    label: social.label,
    href: social.href,
    display: socialDisplay(social.href, social.id),
  })),
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Contact() {
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
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full max-w-2xl">

      <h1 className={`text-5xl sm:text-7xl ${decoMedium} text-foreground mb-4`}>
        Contact
      </h1>
      <p className="text-lg text-muted mb-16 leading-relaxed">
        Available for freelance projects and full-time roles. I&apos;m always happy to talk through an idea — drop me a message and I&apos;ll get back to you within a day or two.
      </p>

      <form className="flex flex-col gap-5 mb-16" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="Tell me about your project…"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors resize-none"
          />
        </div>

        {status === "success" && (
          <p className="text-sm text-foreground">{`Message sent — I'll get back to you soon.`}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className={`self-start px-6 py-3 rounded-full bg-foreground text-background text-sm hover:opacity-80 transition-opacity disabled:opacity-50 ${sansBold}`}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </form>

      <div className="pt-12 border-t border-border">
        <h2 className={`text-xl ${decoMedium} text-foreground mb-6`}>
          Elsewhere
        </h2>
        <div className="flex flex-col gap-4">
          {ELSEWHERE_LINKS.map((link) => (
            <div key={link.label} className="flex items-center justify-between gap-8">
              <span className={`text-sm text-muted uppercase tracking-widest shrink-0 ${sansLight}`}>{link.label}</span>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`text-sm text-foreground hover:text-muted transition-colors text-right ${sansMedium}`}
              >
                {link.display}
              </a>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
