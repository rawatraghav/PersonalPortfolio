import type { IconType } from "react-icons";
import SectionIntro from "@/components/SectionIntro";
import {
  SiAmazon,
  SiApacheairflow,
  SiApachehadoop,
  SiCplusplus,
  SiClickhouse,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiGooglecloud,
  SiHuggingface,
  SiKubernetes,
  SiMysql,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiR,
  SiReact,
  SiScikitlearn,
  SiSentry,
  SiTensorflow,
  SiTerraform,
  SiTypescript,
  SiWeightsandbiases,
} from "react-icons/si";

const skillCategories: {
  title: string;
  skills: { name: string; icon?: IconType }[];
}[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "PyTorch", icon: SiPytorch },
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "C++", icon: SiCplusplus },
      { name: "Java" },
      { name: "TypeScript", icon: SiTypescript },
      { name: "SQL", icon: SiMysql },
      { name: "R", icon: SiR },
    ],
  },
  {
    title: "Machine Learning",
    skills: [
      { name: "LoRA" },
      { name: "vLLM" },
      { name: "HuggingFace", icon: SiHuggingface },
      { name: "Quantization" },
      { name: "W&B", icon: SiWeightsandbiases },
      { name: "MLflow" },
      { name: "LangSmith" },
      { name: "RAG" },
      { name: "Pinecone" },
      { name: "scikit-learn", icon: SiScikitlearn },
    ],
  },
  {
    title: "Data / Infra",
    skills: [
      { name: "GCP", icon: SiGooglecloud },
      { name: "AWS", icon: SiAmazon },
      { name: "Terraform", icon: SiTerraform },
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Git", icon: SiGit },
      { name: "Sentry", icon: SiSentry },
      { name: "PySpark" },
      { name: "Hadoop", icon: SiApachehadoop },
      { name: "Airflow", icon: SiApacheairflow },
      { name: "Dataiku" },
      { name: "ClickHouse", icon: SiClickhouse },
    ],
  },
  {
    title: "Full-Stack",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "FastAPI", icon: SiFastapi },
      { name: "REST" },
      { name: "gRPC" },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Firestore", icon: SiFirebase },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionIntro
          index="04 — Skills"
          title="Tools I use in production."
          lede="Serving, routing, and evaluating models. Distributed systems when the data is too big for one machine."
        />
        <div className="border-t border-border">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="grid gap-4 border-b border-border py-6 md:grid-cols-[180px_1fr] md:items-center md:py-7"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {category.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm"
                  >
                    {skill.icon ? (
                      <skill.icon className="h-4 w-4" aria-hidden />
                    ) : null}
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
