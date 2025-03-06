import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { fadeIn } from "@/lib/motion";

const projects = [
  {
    title: "WIRIN",
    description: "Developed deep learning models for acoustic event annotation in autonomous vehicles, improving detection accuracy by 70%.",
    technologies: ["NumPy", "Librosa", "TensorFlow"],
    github: "https://github.com/rawatraghav/AcousticDL-EmergencySounds",
    live: null
  },
  {
    title: "DOHlyzer",
    description: "Analyzed network traffic using deep learning to identify malicious activities, processing over 1.2M packets of HTTPS traffic.",
    technologies: ["PyTorch", "Scapy", "NetworkX"],
    github: null,
    live: "https://ieeexplore.ieee.org/abstract/document/9587555"
  },
  {
    title: "RxVision",
    description: "A solution to drug underuse and overuse through paired patient-medicine tracking.",
    technologies: ["TensorFlow", "Next.js", "Flask", "Redis", "OpenCV"],
    github: null,
    live: "https://hacklytics-2024.devfolio.co/projects/rxvision-308a",
    highlights: [
      "Developed FaceNet feature extractor for face embeddings.",
      "Fine-tuned GoogLeNet for available medicine classes."
    ]
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary/10 rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" asChild>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
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
