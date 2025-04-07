import { motion } from "framer-motion";

interface TimelineProps {
  experiences: Array<{
    title: string;
    company: string;
    period: string;
    logo: string;
  }>;
}

export default function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative max-w-md">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-muted-foreground/20 transform -translate-x-1/2" />

      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ 
            type: "tween", 
            duration: 0.2,
            ease: "easeOut"
          }}
          className={`relative mb-5 last:mb-0 flex items-center cursor-pointer ${
            index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          {/* Logo in center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center overflow-hidden">
              <img
                src={exp.logo}
                alt={`${exp.company} logo`}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`w-[calc(50%-20px)] ${
            index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
          }`}>
            <div className="p-3 rounded-lg">
              <h3 className="text-sm font-medium transition-all duration-200">
                {exp.company}
              </h3>
              <p className="text-xs text-muted-foreground">
                {exp.title}
              </p>
              <span className="text-xs text-muted-foreground">
                {exp.period}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 