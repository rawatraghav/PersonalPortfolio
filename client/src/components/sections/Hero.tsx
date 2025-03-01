import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hi, I'm{" "}
            <span className="text-primary">YourName</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            A software engineer passionate about building elegant solutions to complex problems.
            Currently focused on web development and cloud architecture.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <a href="#contact">
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#projects">View Projects</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
