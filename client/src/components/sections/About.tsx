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
                    I'm a software engineer with X years of experience building web applications
                    and distributed systems. My journey in tech started with [your background],
                    and I've since worked on projects ranging from [types of projects].
                  </p>
                  <p className="text-lg mb-4">
                    Currently, I'm focused on [current focus/interests]. I'm passionate about
                    [specific areas of interest] and always excited to learn new technologies.
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>🎓 Education: Your Degree</p>
                    <p>📍 Location: Your Location</p>
                    <p>💼 Current Role: Your Role</p>
                    <p>🌟 Interests: Interest 1, Interest 2</p>
                    <p>🎯 Goals: Your Professional Goals</p>
                  </div>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src="https://avatars.githubusercontent.com/u/yourusername"
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