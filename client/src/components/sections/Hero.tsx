import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experiences, profile, stats } from "@/data/site";

const current = experiences[0];

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at top left, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top left, black 20%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 content-center gap-12 px-6 py-12 lg:grid-cols-12 lg:items-end lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            {profile.kicker}
          </p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
            Raghav
            <br />
            Rawat
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {profile.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#projects"
              className="inline-flex h-11 items-center border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Selected work
            </a>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="border border-border bg-background/70 p-6 backdrop-blur-sm lg:col-span-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Currently
          </p>
          <p className="mt-3 font-serif text-3xl leading-tight">{current.title}</p>
          <p className="mt-1 text-muted-foreground">{current.company}</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">{current.period}</p>
          <div className="mt-6 border-t border-border pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Focus
            </p>
            <p className="mt-2 text-sm leading-relaxed">{profile.focus}</p>
          </div>
        </motion.aside>
      </div>

      <div className="relative border-t border-border">
        <dl className="mx-auto grid max-w-6xl md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-border px-6 py-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <dt className="font-serif text-4xl tracking-tight">{stat.value}</dt>
              <dd className="mt-2 text-sm">{stat.label}</dd>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {stat.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
