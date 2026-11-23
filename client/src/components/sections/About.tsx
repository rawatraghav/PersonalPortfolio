import SectionIntro from "@/components/SectionIntro";
import { experiences, profile } from "@/data/site";

const current = experiences[0];

const facts = [
  { label: "Education", value: "MS, Computer Science — NYU" },
  { label: "Earlier", value: "BE, Electronics & Communication — RVCE" },
  { label: "Based", value: profile.location },
  { label: "Now", value: `${current.title}, ${current.company}` },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <figure>
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={profile.photo}
                alt="Raghav Rawat"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              New York City
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-7">
          <SectionIntro index="01 — About" title="Engineer first, then the model." />
          <div className="max-w-xl space-y-4 text-lg leading-relaxed">
            <p>
              I build the systems around large language models: serving,
              evaluation, and the product that has to stay up after the demo.
              Right now that is phishing detection at AegisAI. Before that,
              LLM infrastructure at MARV Capital and claims modeling at ZS.
            </p>
            <p>
              MS in Computer Science from NYU, August 2023 to May 2025, on a
              merit scholarship. Before that, electronics and communication
              engineering at R.V. College of Engineering, with a research award.
            </p>
          </div>
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {fact.label}
                </dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
