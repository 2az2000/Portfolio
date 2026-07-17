/**
 * The shape every locale dictionary must satisfy. Sections read text from
 * here ONLY — never inline a Persian/English string in a component
 * (AGENTS.md §5, modularity rule 2).
 *
 * Amirali: fill in the // TODO values with your real project + contact
 * content. The shape must stay identical between en.ts and fa.ts.
 */
export type Dictionary = {
  nav: {
    about: string;
    skills: string;
    projects: string;
    playground: string;
    experience: string;
    contact: string;
  };
  hero: {
    eyebrow: string; // e.g. "// building interfaces that actually respond"
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    heading: string;
    body: string; // TODO: replace with your real bio
  };
  skills: {
    heading: string;
    subheading: string;
  };
  projects: {
    heading: string;
    subheading: string;
    items: {
      title: string;
      description: string; // TODO: replace
      stack: string[];
      href: string; // TODO: replace with live/github link
      featured?: boolean;
    }[];
  };
  playground: {
    heading: string;
    subheading: string;
  };
  experience: {
    heading: string;
    subheading: string;
    items: {
      hash: string;
      message: string; // TODO: replace with real role/achievement
      date: string;
      company: string; // TODO: replace with the real company/organization name
      role: string; // TODO: replace if the title differed per job
    }[];
  };
  contact: {
    heading: string;
    subheading: string;
    fieldName: string;
    fieldEmail: string;
    fieldMessage: string;
    submit: string;
    // TODO: replace with real links
    email: string;
    github: string;
    linkedin: string;
  };
};

export const en: Dictionary = {
  nav: {
    about: "About",
    skills: "Skills",
    projects: "Projects",
    playground: "Playground",
    experience: "Experience",
    contact: "Contact",
  },
  hero: {
    eyebrow: "// building interfaces that actually respond",
    title: "Amirali Zand",
    subtitle: "Frontend Developer — React, Next.js, TypeScript & the Node.js ecosystem.",
    ctaPrimary: "View projects",
    ctaSecondary: "Get in touch",
  },
  about: {
    heading: "About",
    body: "I'm a frontend developer who believes the best interfaces are the ones that feel alive. With a focus on React, Next.js, and TypeScript, I build applications that don't just work — they respond, adapt, and surprise. Every pixel, every transition, every micro-interaction is intentional. I don't write code to fill a screen; I craft experiences that prove the craft.",
  },
  skills: {
    heading: "Skills",
    subheading: "How the pieces connect, not just a list.",
  },
  projects: {
    heading: "Projects",
    subheading: "A few things I've shipped.",
    items: [
      {
        title: "TODO: Project One",
        description: "TODO: replace with a real description.",
        stack: ["React", "TypeScript"],
        href: "#",
        featured: true,
      },
      {
        title: "TODO: Project Two",
        description: "TODO: replace with a real description.",
        stack: ["Next.js", "Node.js"],
        href: "#",
      },
      {
        title: "TODO: Project Three",
        description: "TODO: replace with a real description.",
        stack: ["TypeScript"],
        href: "#",
      },
    ],
  },
  playground: {
    heading: "Playground",
    subheading: "A shelf of components you can actually use.",
  },
experience: {
  heading: "Experience",
  subheading: "Where the commits actually happened.",
  items: [
    {
      hash: "f8a21d4",
      message: "Rebuilt the Sib Irani platform with Next.js & TypeScript",
      date: "2025",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "d1bc93e",
      message: "Developed Face Age using webcam & Mediapipe integration",
      date: "2025",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "91ea0fd",
      message: "Built scalable dashboards for the Developer Platform",
      date: "2024",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "74c8fa1",
      message: "Shipped Brookli, a calorie-tracking progressive web app",
      date: "2024",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "5be20f7",
      message: "Managed staging releases and CI/CD workflow",
      date: "2024",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "ab4329d",
      message: "Created a reusable React architecture and shared components",
      date: "2024",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "4fd80a2",
      message: "Optimized rendering, API flow and application performance",
      date: "2024",
      company: "TODO: Company Name",
      role: "Frontend Developer",
    },
    {
      hash: "7ac52bf",
      message: "Started professional frontend engineering journey",
      date: "2023",
      company: "TODO: Company Name",
      role: "Junior Frontend Developer",
    },
  ],
},
  contact: {
    heading: "Let's talk",
    subheading: "Open to new opportunities and collaborations.",
    fieldName: "--name",
    fieldEmail: "--email",
    fieldMessage: "--message",
    submit: "run send.sh",
    email: "TODO@example.com",
    github: "https://github.com/TODO",
    linkedin: "https://linkedin.com/in/TODO",
  },
};
