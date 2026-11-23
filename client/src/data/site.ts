const baseUrl = import.meta.env.VITE_BASE_URL || "";

export const profile = {
  name: "Raghav Rawat",
  role: "Software engineer",
  location: "New York City",
  email: "rawat.raghav3w@gmail.com",
  phone: "+1 347 875 2856",
  phoneHref: "tel:+13478752856",
  resume: `${baseUrl}/Raghav_Rawat_Resume.pdf`,
  linkedin: "https://www.linkedin.com/in/raghav-rawat/",
  github: "https://github.com/rawatraghav",
  scholar: "https://scholar.google.com/citations?user=nWw3nDUAAAAJ&hl=en",
  photo: `${baseUrl}/images/portrait.jpg`,
  kicker: "New York City · LLM systems",
  summary:
    "I build production LLM systems: serving, evaluation, and the software around them.",
  focus:
    "Phishing detection at AegisAI: LoRA serving, the analyst labeling loop, and multi-tenant infrastructure. MS in Computer Science, NYU.",
};

export const navLinks = [
  { title: "About", href: "#about" },
  { title: "Experience", href: "#experience" },
  { title: "Projects", href: "#projects" },
  { title: "Skills", href: "#skills" },
  { title: "Contact", href: "#contact" },
];

export const stats = [
  {
    value: "4–5M",
    label: "Emails scored each weekday",
    detail: "LLM serving at AegisAI",
  },
  {
    value: "80%",
    label: "Inference cost reduction",
    detail: "Self-hosted LLMs at MARV Capital",
  },
  {
    value: "$4M+",
    label: "Claims savings found",
    detail: "PySpark pipelines at ZS",
  },
];

export const experiences: {
  title: string;
  company: string;
  logo?: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}[] = [
  {
    title: "AI Engineer - Founding Team",
    company: "AegisAI Security",
    period: "Sept 2025 — Present",
    location: "New York City",
    description:
      "Production LLM serving and detection for phishing, from the model to the multi-tenant platform.",
    highlights: [
      "Diagnosed a production LoRA model that mixed spam with promotional mail, then full fine-tuned BERT to fix it, comparing runs in Weights & Biases and inspecting outputs in LangSmith",
      "Built Lookout in TypeScript, React, and Firestore so 8 analysts can label production data into evaluation sets and retraining data, with authentication, authorization, and deep links",
      "Deployed the LoRA-tuned LLM on vLLM with tensor parallelism and continuous batching, scoring 4–5M emails each weekday (~170/s peak) at 0.4s median latency (4s p95, 7s p99), contributing to about a 10% increase in ARR",
      "Built a Pinecone retrieval layer that compares senders with known-legitimate ones, giving the model context and cutting false positives against the labeled evaluation sets",
      "Ran it as a multi-tenant platform for ~60 tenants on Terraform-provisioned GCP, with REST and gRPC APIs, Sentry, and ClickHouse cost tracking, and resolved per-tenant production incidents",
    ],
  },
  {
    title: "Machine Learning Intern — LLM Infrastructure",
    company: "MARV Capital",
    logo: `${baseUrl}/images/marv.jpeg`,
    period: "Jan 2025 — Sept 2025",
    location: "New York City",
    description:
      "Multi-backend LLM infrastructure, token-level cost accounting, and an evaluation harness for choosing models.",
    highlights: [
      "Built an evaluation harness that benchmarks open-weight models on QA, summarization, and code generation, using MLflow sweeps and LangSmith tracing to guide prompt tuning and model selection",
      "Cut inference cost by 80% by self-hosting open-weight LLMs on AWS, and raised throughput 40% with caching and context-window optimization",
      "Built multi-backend LLM infrastructure in Python and FastAPI with dynamic routing and token-level cost accounting",
    ],
  },
  {
    title: "Data Scientist",
    company: "ZS Associates",
    logo: `${baseUrl}/images/zs.png`,
    period: "Feb 2022 — Aug 2023",
    location: "Bangalore",
    description:
      "Distributed claims pipelines and production models for Fortune 50 pharmaceutical clients.",
    highlights: [
      "Productionized TensorFlow models in Dataiku and automated retraining with Airflow and Hadoop across six client portfolios",
      "Built PySpark pipelines over 5M+ medical claims, uncovering $4M+ in cost savings, and ran statistical simulations in R that raised marketing ROI by 15%",
    ],
  },
];

export type ProjectLink = {
  href: string;
  label: string;
};

export const projects: {
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
}[] = [
  {
    title: "LLM Training & Inference Optimization",
    description:
      "Transformer NanoGPT in PyTorch on an HPC cluster. Multi-GPU parallelism cut training time by 57%. Compression and quantization on a domain-specific corpus cut inference latency and cost by 35%.",
    technologies: ["PyTorch", "CUDA", "Quantization"],
    links: [],
  },
  {
    title: "WIRIN",
    description:
      "Real-time audio classifiers for siren detection at the Indian Institute of Science. Detection improved by 70%. FASTGRNN compression cut model size by 60% and compute by 92%.",
    technologies: ["TensorFlow", "Librosa", "FASTGRNN"],
    links: [
      {
        href: "https://github.com/rawatraghav/AcousticDL-EmergencySounds",
        label: "Code",
      },
    ],
  },
  {
    title: "3D Brain MRI Segmentation",
    description:
      "Transfer learning on a 3D U-Net accelerated volumetric segmentation by 45%. TensorFlow Profiler found the GPU bottlenecks in the training pipeline.",
    technologies: ["TensorFlow", "3D U-Net", "Transfer Learning"],
    links: [
      {
        href: "https://github.com/utkarsh231/Transfer-Learning-Approach-to-optimize-3D-Brain-MRI-Segmentation",
        label: "Code",
      },
    ],
  },
];

export const publications: ProjectLink[] = [
  {
    label: "FastGRNN",
    href: "https://ieeexplore.ieee.org/abstract/document/9633681",
  },
  {
    label: "Distress Recognition",
    href: "https://ieeexplore.ieee.org/document/9410753",
  },
  {
    label: "DOHlyzer",
    href: "https://ieeexplore.ieee.org/abstract/document/9587555",
  },
  {
    label: "Quantum ML for HQC",
    href: "https://ieeexplore.ieee.org/document/9410753",
  },
];
