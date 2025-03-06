import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn } from "@/lib/motion";

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">About Me</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg mb-4">
                    I'm a software engineer with experience in machine learning, distributed systems,  
                    and full-stack development. My journey in tech started with my background in Computer Engineering,  
                    and I've since worked on projects involving AI research, cloud computing, and scalable backend systems.
                  </p>
                  <p className="text-lg mb-4">
                    Currently, I'm focused on generative AI and MLOps. I'm passionate about  
                    building efficient AI-powered applications and optimizing machine learning pipelines.
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>🎓 Education: MS in Computer Engineering, New York University</p>
                    <p>📍 Location: New York City, NY</p>
                    <p>💼 Current Role: Machine Learning Intern at MARV Capital</p>
                    <p>🌟 Interests: Machine Learning, Generative AI, Distributed Systems</p>
                    <p>🎯 Goals: Advancing AI-driven applications and scalable software architectures</p>
                  </div>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src="../../src/public/me.JPEG"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}