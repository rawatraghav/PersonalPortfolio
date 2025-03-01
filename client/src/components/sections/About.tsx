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
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg mb-4">
                    I'm a software engineer with X years of experience building web applications
                    and distributed systems. My journey in tech started with [your background],
                    and I've since worked on projects ranging from [types of projects].
                  </p>
                  <p className="text-lg mb-4">
                    Currently, I'm focused on [current focus/interests]. I'm passionate about
                    [specific areas of interest] and always excited to learn new technologies.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>🎓 Education: Your Degree</li>
                    <li>📍 Location: Your Location</li>
                    <li>💼 Current Role: Your Role</li>
                    <li>🌟 Interests: Interest 1, Interest 2</li>
                    <li>🎯 Goals: Your Professional Goals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
