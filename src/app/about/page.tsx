import TransitionLink from "@/components/transition-link";
import {
  ABOUT_INTRO,
  EDUCATION,
  HIGHLIGHTS,
  INTERESTS,
  SKILLS,
} from "@/lib/about-content";
import { createPageMetadata } from "@/lib/site-metadata";
import { decoMedium, sansBold, sansLight, sansMedium } from "@/lib/typography";

export const metadata = createPageMetadata("About", ABOUT_INTRO[0].slice(0, 160));

export default function About() {
  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full max-w-3xl">

      <h1 className={`text-5xl sm:text-7xl ${decoMedium} text-foreground mb-12`}>
        About
      </h1>

      <div className="space-y-5 text-lg text-muted leading-relaxed mb-16">
        {ABOUT_INTRO.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <div className="mb-16">
        <h2 className={`text-2xl ${decoMedium} text-foreground mb-8`}>
          Education
        </h2>
        <div className="flex flex-col gap-8">
          {EDUCATION.map((entry) => (
            <div
              key={entry.institution}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2 sm:gap-6 pb-8 border-b border-border last:border-0 last:pb-0"
            >
              <div>
                <p className={`text-sm text-muted ${sansLight}`}>{entry.period}</p>
                <p className={`text-sm text-muted ${sansLight}`}>{entry.institution}</p>
              </div>
              <div>
                <p className={`text-base ${sansBold} text-foreground leading-relaxed`}>
                  {entry.qualification}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className={`text-2xl ${decoMedium} text-foreground mb-8`}>
          Highlights
        </h2>
        <div className="flex flex-col gap-8">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2 sm:gap-6 pb-8 border-b border-border last:border-0 last:pb-0"
            >
              <div>
                <p className={`text-sm text-muted ${sansLight}`}>{item.period}</p>
              </div>
              <div>
                <p className={`text-base ${sansBold} text-foreground mb-1`}>
                  {item.title}
                </p>
                <p className={`text-sm text-muted leading-relaxed ${sansLight}`}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className={`text-2xl ${decoMedium} text-foreground mb-8`}>
          Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SKILLS.map((group) => (
            <div key={group.category}>
              <p className={`text-xs uppercase tracking-widest text-muted mb-3 ${sansLight}`}>
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <span
                    key={s}
                    className={`px-4 py-1.5 rounded-full bg-surface border border-border text-sm text-muted ${sansMedium}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className={`text-2xl ${decoMedium} text-foreground mb-6`}>
          Interests
        </h2>
        <ul className={`space-y-3 text-base text-muted leading-relaxed list-disc pl-5 ${sansLight}`}>
          {INTERESTS.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>

      <TransitionLink
        href="/contact"
        className={`inline-block px-6 py-3 rounded-full bg-foreground text-background text-[15px] hover:opacity-80 transition-opacity ${sansBold}`}
      >
        Get in touch
      </TransitionLink>

    </section>
  );
}
