import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/motion";
import { Mail, Linkedin, Github, ChevronDown } from "lucide-react";

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
          <h1 className="text-4xl md:text-6xl mb-6">
            Hi, I'm{" "}
            <span className="font-bold">Raghav Rawat</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            A software engineer passionate about building elegant solutions to complex problems.
            I possess a strong expertise in ML Systems, Gen-AI and full-stack development.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <a href="https://drive.google.com/drive/u/1/folders/1CXntERChEPwUs_eBxQ7u0Yp_wEBrGo7X" target="_blank">
                Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#projects">View Projects</a>
            </Button>
          </div>
          <div className="flex gap-4 justify-start mt-8">
            <Button variant="outline" asChild>
              <a href="mailto:rr3418@nyu.edu">
                <Mail className="mr-2 h-4 w-4" />
                Email Me
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://linkedin.com/in/raghav-rawat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/rawatraghav"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </section>
  );
}
