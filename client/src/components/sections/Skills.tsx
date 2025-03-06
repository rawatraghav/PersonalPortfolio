import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn } from "@/lib/motion";
import { 
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiRedux,
  SiNodedotjs, SiExpress, SiPython, SiPostgresql, SiMongodb,
  SiGit, SiDocker, SiAmazon, SiGithubactions, SiLinux, 
  SiDjango, SiFlask, SiFastapi, SiTensorflow, SiPytorch,
  SiLangchain, SiHuggingface, SiApachespark,
  SiGooglecloud, SiKubernetes, SiJavascript, SiMysql,
  SiCplusplus
} from "react-icons/si";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: SiReact },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Django", icon: SiDjango },
      { name: "Flask", icon: SiFlask },
      { name: "FastAPI", icon: SiFastapi },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Node.js", icon: SiNodedotjs },
    ],
  },
  {
    title: "Machine Learning & AI",
    skills: [
      { name: "TensorFlow", icon: SiTensorflow },
      { name: "PyTorch", icon: SiPytorch },
      { name: "LangChain", icon: SiLangchain },
      { name: "Hugging Face", icon: SiHuggingface },
      { name: "Spark", icon: SiApachespark },
    ],
  },
  {
    title: "DevOps & Cloud",
    skills: [
      { name: "AWS", icon: SiAmazon },
      { name: "GCP", icon: SiGooglecloud },
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "CI/CD", icon: SiGithubactions },
    ],
  },
  {
    title: "Programming Languages",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "C++", icon: SiCplusplus },
      { name: "JavaScript", icon: SiJavascript },
      { name: "SQL", icon: SiMysql },
      // { name: "Java", icon: SiJava },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Skills</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 px-3 py-2 bg-background rounded-full border"
                      >
                        <skill.icon className="h-5 w-5" style={{ color: 'currentcolor' }} />
                        <span className="text-sm">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}