import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeIn } from "@/lib/motion";

const experiences = [
  {
    title: "Machine Learning Intern",
    company: "MARV Capital",
    period: "Jan 2025 - Present",
    description: "Migrated chatbot service to self-hosted model and optimized API routes for cost efficiency.",
    highlights: [
      "Transitioned from Mistral APIs to Deepseek on AWS Bedrock",
      "Reduced API costs by 80%",
      "Managed and tested API route functionality"
    ]
  },
  {
    title: "Software Development Intern",
    company: "New York University",
    period: "May 2024 - Aug 2024",
    description: "Built an interactive web platform to visualize floor plans and manage academic space efficiently.",
    highlights: [
      "Developed an interactive tool for visualizing classrooms, labs, and offices across 5 academic buildings.",
      "Enhanced space management efficiency by 30% for 300+ faculty and staff.",
      "Implemented real-time equipment data updates, reducing tracking time by 25%."
    ]
  },
  {
    title: "Graduate Research Assistant (MS Thesis)",
    company: "New York University",
    period: "Oct 2023 - Present",
    description: "Developed a real-time video alert system for visually impaired individuals.",
    highlights: [
      "Designed a real-time depth mapping network",
      "Reduced inference time by 50 ms",
      "Improved model accuracy by 15% over state-of-the-art methods"
    ]
  },
  {
    title: "CS Intern",
    company: "Tiny Archives",
    period: "Jun 2024 - Aug 2024",
    description: "Worked on API integrations and retrieval-augmented generation for a Copilot feature.",
    highlights: [
      "Developed API integrations for third-party platform synchronization",
      "Engineered data pipelines for RAG system",
      "Worked on online learning techniques and model training"
    ]
  },
  {
    title: "Data Scientist",
    company: "ZS Associates",
    period: "Feb 2022 - Aug 2023",
    description: "Led data processing and modeling for pharmaceutical clients to optimize investment strategies.",
    highlights: [
      "Processed patient-level data for Fortune 50 pharma clients",
      "Improved decision-making accuracy by 20%, saving $4M",
      "Enhanced marketing ROI by 15% through statistical modeling"
    ]
  },
  {
    title: "Research Intern",
    company: "Samsung R&D",
    period: "Jul 2021 - Nov 2021",
    description: "Implemented AI-driven optimization strategies for UAV task offloading.",
    highlights: [
      "Developed Monte Carlo Tree Search (MCTS) for UAV efficiency",
      "Improved task offloading by 71%",
      "Designed reinforcement learning models for UAV trajectory management"
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Experience</h2>
          <div className="flex justify-center">
            <div className="space-y-6 w-full max-w-3xl">
              {experiences.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{exp.period}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{exp.description}</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
