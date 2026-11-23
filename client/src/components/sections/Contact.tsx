import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/site";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: profile.phoneHref },
  { label: "LinkedIn", value: "raghav-rawat", href: profile.linkedin },
  { label: "GitHub", value: "rawatraghav", href: profile.github },
  { label: "Scholar", value: "Google Scholar", href: profile.scholar },
  { label: "Resume", value: "PDF", href: profile.resume },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          05 — Contact
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
          If you are building something difficult, I would like to hear about it.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          New roles, research collaborations, and questions are all welcome.
          The fastest reply is email.
        </p>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 py-5"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {channel.label}
                </span>
                <span className="inline-flex items-center gap-2 text-right font-serif text-xl tracking-tight transition-colors group-hover:text-primary sm:text-2xl md:text-3xl">
                  {channel.value}
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
