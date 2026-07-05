"use client";

const SOCIALS = [
  { label: "Email",    href: "mailto:your@email.com",              display: "your@email.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourprofile", display: "linkedin.com/in/yourprofile" },
  { label: "GitHub",   href: "https://github.com/yourusername",     display: "github.com/yourusername" },
  { label: "Twitter",  href: "https://twitter.com/yourhandle",      display: "@yourhandle" },
];

export default function Contact() {
  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full max-w-2xl">

      <h1
        className="text-5xl sm:text-7xl font-normal text-foreground mb-4"
        style={{ fontFamily: "var(--font-knile)" }}
      >
        Contact
      </h1>
      <p
        className="text-lg text-muted mb-16 leading-relaxed"
        style={{ fontFamily: "var(--font-strawford)" }}
      >
        Available for freelance projects and full-time roles. I&apos;m always happy to talk through an idea — drop me a message and I&apos;ll get back to you within a day or two.
      </p>

      {/* Form */}
      <form className="flex flex-col gap-5 mb-16" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-widest text-muted"
              style={{ fontFamily: "var(--font-strawford)" }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
              style={{ fontFamily: "var(--font-strawford)" }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-widest text-muted"
              style={{ fontFamily: "var(--font-strawford)" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors"
              style={{ fontFamily: "var(--font-strawford)" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-xs uppercase tracking-widest text-muted"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            Message
          </label>
          <textarea
            rows={5}
            placeholder="Tell me about your project…"
            className="px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-muted transition-colors resize-none"
            style={{ fontFamily: "var(--font-strawford)" }}
          />
        </div>
        <button
          type="submit"
          className="self-start px-6 py-3 rounded-full bg-foreground text-background text-sm hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          Send message
        </button>
      </form>

      {/* Socials */}
      <div className="pt-12 border-t border-border">
        <h2
          className="text-xl font-normal text-foreground mb-6"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          Elsewhere
        </h2>
        <div className="flex flex-col gap-4" style={{ fontFamily: "var(--font-strawford)" }}>
          {SOCIALS.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-sm text-muted uppercase tracking-widest">{s.label}</span>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-muted transition-colors"
              >
                {s.display}
              </a>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
