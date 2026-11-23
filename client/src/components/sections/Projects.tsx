import { ArrowUpRight } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";
import { projects, publications } from "@/data/site";

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionIntro
          index="03 — Projects"
          title="Selected work."
          lede="Training systems, on-device audio, and 3D medical imaging, plus the papers that came out of the research."
        />

        <div className="border-t border-border">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="grid gap-6 border-b border-border py-8 md:grid-cols-[72px_1fr] md:py-10"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl tracking-tight md:text-4xl">
                    {project.title}
                  </h3>
                  <div className="flex gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-primary hover:underline"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Publications
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {publications.map((paper) => (
              <li key={paper.label}>
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm hover:text-primary"
                >
                  {paper.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
