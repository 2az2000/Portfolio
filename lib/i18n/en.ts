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
    caseStudies: string;
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
  caseStudies: {
    heading: string;
    subheading: string;
    problemLabel: string;
    approachLabel: string;
    resultLabel: string;
    viewLive: string;
    items: {
      title: string;
      tagline: string;
      role: string;
      problem: string;
      approach: string;
      result: string;
      stack: string[];
      href: string;
    }[];
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
    caseStudies: "Case Studies",
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
        title: "Sib Irani",
        description:
          "An Iranian alternative app store distributing lightweight, WebView-based iOS & Android apps without an Apple ID — plus a developer portal for local publishers.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibirani.com",
        featured: true,
      },
      {
        title: "Sib Bazar",
        description:
          "A sister iOS app-store platform for Iranian users, with its own proprietary Adhoc distribution pipeline and a separate developer dashboard.",
        stack: ["React", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "Brookli",
        description:
          "A calorie-tracking progressive web app for logging meals and following daily nutrition goals.",
        stack: ["React", "PWA"],
        href: "https://app.brookliapp.com/",
      },
      {
        title: "fabioCoffee",
        description:
          "A full-stack café management system — a Next.js ordering menu and admin panel backed by an Express/Prisma/PostgreSQL API with JWT authentication.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
      },
      {
        title: "smartShop",
        description:
          "A Next.js e-commerce storefront with Clerk authentication, a Prisma-backed product catalog, and a shadcn/ui component layer.",
        stack: ["Next.js", "Clerk", "Prisma"],
        href: "https://github.com/2az2000/smartShop",
      },
      {
        title: "saghfino",
        description:
          "A map-based real-estate rental platform for browsing listings by location, built with React, Vite, and Leaflet.",
        stack: ["React", "Vite", "Leaflet"],
        href: "https://github.com/2az2000/saghfino",
      },
    ],
  },
  caseStudies: {
    heading: "Case Studies",
    subheading: "Two projects, from the problem to what shipped.",
    problemLabel: "Problem",
    approachLabel: "Approach",
    resultLabel: "Result",
    viewLive: "View live",
    items: [
      {
        title: "Sib Irani",
        tagline:
          "Rebuilding an Iranian iOS/Android app store's Next.js frontend from the ground up.",
        role: "Frontend Developer — rebuilt the Next.js version from scratch",
        problem:
          "The existing Sib Irani frontend needed a full rebuild to support new PWA capabilities and a growing developer portal for local publishers, so the Next.js implementation was rewritten from zero.",
        approach:
          "Rebuilt the Next.js frontend from scratch, implemented full PWA support (installable, offline-capable), shipped several AI-powered features, and worked closely with backend, design, and product teams to ship a stable developer portal — all while continuously profiling and restructuring the codebase for performance.",
        result:
          "A faster, more maintainable Next.js codebase now powering one of Iran's alternative iOS/Android app stores — hosting dozens of popular local apps (Snapp, Digikala, Divar, and more) alongside an active developer portal.",
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
      },
      {
        title: "Brookli",
        tagline: "A calorie-tracking PWA you can install straight from the browser.",
        role: "Frontend Developer",
        problem:
          "Brookli needed a lightweight, installable nutrition-tracking experience that worked reliably as a PWA across devices, without the overhead of a native app.",
        approach:
          "Implemented the PWA foundations (install prompts, offline caching, service worker), shipped AI-powered features, coordinated with the product/design team on the meal-logging flow, and optimized rendering performance across the app.",
        result:
          "A stable, installable PWA that lets users log meals and track calories entirely from the browser — no app-store download required.",
        stack: ["React", "PWA"],
        href: "https://app.brookliapp.com/",
      },
    ],
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
    github: "https://github.com/2az2000",
    linkedin: "https://linkedin.com/in/TODO",
  },
};
