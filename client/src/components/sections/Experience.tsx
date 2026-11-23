import SectionIntro from "@/components/SectionIntro";
import { experiences } from "@/data/site";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionIntro
          index="02 — Experience"
          title="Where the work happened."
          lede="A security startup, an investment firm, and a pharma consultancy. The through-line is models that have to run in production."
        />

        <ol className="border-t border-border">
          {experiences.map((exp) => (
            <li
              key={`${exp.company}-${exp.period}`}
              className="grid gap-5 border-b border-border py-8 md:grid-cols-[180px_1fr] md:gap-10 md:py-10"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground">{exp.period}</p>
                <p className="mt-1 text-xs text-muted-foreground">{exp.location}</p>
              </div>
              <div>
                <div className="flex items-start gap-4">
                  {exp.logo ? (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1.5">
                      <img
                        src={exp.logo}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </span>
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border font-serif text-lg">
                      {exp.company.slice(0, 1)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-serif text-2xl tracking-tight md:text-3xl">
                      {exp.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{exp.company}</p>
                  </div>
                </div>
                <p className="mt-5 max-w-2xl leading-relaxed">{exp.description}</p>
                <ul className="mt-4 max-w-2xl space-y-2 text-muted-foreground">
                  {exp.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 leading-relaxed">
                      <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
