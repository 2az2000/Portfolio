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
    // Labels only — the numeric values are computed from real data
    // (experience/projects/caseStudies arrays below) inside Hero.tsx,
    // never hardcoded, so they can't drift out of sync with the rest
    // of the site.
    stats: {
      years: string;
      projects: string;
      caseStudies: string;
    };
    scrollCue: string;
    /**
     * Labels for the fact rail that closes the hero (components/HeroCluster).
     * Labels only, again — the role/company, the newest shipped product and
     * the links themselves are read from `experience`, `projects` and
     * `contact` below, and the clock is computed live, so nothing in the rail
     * can contradict the sections further down the page.
     */
    rail: {
      now: string;
      localTime: string;
      city: string;
      latest: string;
      links: string;
      github: string;
      email: string;
    };
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
      description: string;
      stack: string[];
      href: string;
      featured?: boolean;
      /**
       * Short label separating products that shipped to real users from
       * things built in the open. Translated per locale, so it lives here
       * rather than as a union of English keys in the component.
       */
      context: string;
      /**
       * Extra detail for the featured card only. It gets four times the area
       * of a regular card, so a single sentence leaves it looking empty —
       * these fill it with the specifics the description has no room for.
       */
      highlights?: string[];
      /**
       * Path to the product's own logo in /public. Optional — cards without
       * one fall back to the AZ monogram (see `FALLBACK_LOGO` in
       * `components/sections/Projects.tsx`), so the grid never mixes cards
       * that start with an icon and cards that start with a title.
       */
      logo?: string;
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
    sending: string;
    success: string;
    errorGeneric: string;
    /**
     * The terminal transcript the form prints while submitting. Each line is
     * tied to a real step, and `{ms}` is filled with the measured duration of
     * the actual request — never a simulated one. The technical tokens
     * (`--name`, `POST /api/contact`) stay Latin in both locales: they are the
     * literal flags and route, not prose.
     */
    log: {
      validating: string;
      request: string;
      /** Contains `{ms}`. */
      delivered: string;
      /** Contains `{ms}`. */
      failed: string;
    };
    // TODO: replace with real links
    email: string;
    github: string;
    linkedin: string;
    /**
     * Résumé preview card + dialog. `documentUrl` is the embeddable/standalone
     * HTML in /public (the single source of truth for the document) and
     * `pdfUrl` its printed rendition; both live in the dictionary rather than
     * in the component so a locale can later point at its own résumé.
     */
    resume: {
      eyebrow: string;
      title: string;
      meta: string;
      action: string;
      dialogTitle: string;
      dialogDescription: string;
      openInNewTab: string;
      download: string;
      close: string;
      documentUrl: string;
      pdfUrl: string;
      pdfFileName: string;
    };
  };
  /**
   * The closing colophon (components/Footer.tsx). Labels only — every value
   * beside them is a real build fact inlined by next.config.js, so nothing
   * here can claim a version the bundle isn't actually running.
   */
  footer: {
    /** The mono eyebrow above the block, styled as a shell prompt. */
    command: string;
    keys: {
      framework: string;
      built: string;
      type: string;
      fonts: string;
      motion: string;
    };
    values: {
      selfHosted: string;
    };
    rights: string;
    source: string;
  };
  /**
   * ⌘K command palette (components/ui/CommandPalette.tsx). Only the chrome
   * lives here — every searchable row is built from `nav`, `projects`,
   * `caseStudies` and `contact` above, so the palette can never offer
   * something the page itself doesn't have.
   */
  palette: {
    /** Accessible name for the dialog, and the navbar button's label. */
    title: string;
    description: string;
    placeholder: string;
    empty: string;
    groups: {
      navigate: string;
      projects: string;
      caseStudies: string;
      actions: string;
    };
    actions: {
      themeToLight: string;
      themeToDark: string;
      /** Phrased as "switch to <the other language>", read in the current one. */
      language: string;
      xrayOn: string;
      xrayOff: string;
      xrayHint: string;
      copyEmail: string;
      copied: string;
      resume: string;
    };
    hints: {
      navigate: string;
      select: string;
      close: string;
    };
  };
  /**
   * X-ray mode (components/XRayProvider.tsx) — the shortcut that outlines
   * every region of the page with the file that renders it.
   *
   * The keys under `regions` and `behavioral` must match the ids in
   * `lib/xray.ts` exactly; that file holds the paths, this one holds every
   * word a visitor actually reads. Each note describes the *technique*, not
   * the content — the outline already says where the box is, so the value
   * added here is what a reader can't see by looking.
   */
  xray: {
    /** Sits next to the `X` key cap in the pre-launch hint chip. */
    hint: string;
    title: string;
    description: string;
    exit: string;
    close: string;
    regionsLabel: string;
    behavioralLabel: string;
    regions: {
      navbar: string;
      hero: string;
      marquee: string;
      about: string;
      skills: string;
      projects: string;
      caseStudies: string;
      experience: string;
      contact: string;
      footer: string;
    };
    behavioral: {
      cursor: string;
      curtain: string;
      smoothScroll: string;
      reveal: string;
    };
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
    stats: {
      years: "Years of experience",
      projects: "Projects shipped",
      caseStudies: "Case studies",
    },
    scrollCue: "Scroll",
    rail: {
      now: "Currently",
      localTime: "Local time",
      city: "Tehran",
      latest: "Latest release",
      links: "Quick links",
      github: "GitHub",
      email: "Email",
    },
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
    subheading: "Products in front of real users, and the code I write in the open.",
    items: [
      {
        title: "Sib Irani",
        description:
          "Iran's alternative app store for iOS & Android, distributing lightweight WebView apps without an Apple ID. I inherited a class-based React codebase and rebuilt the entire frontend from zero in Next.js and TypeScript.",
        highlights: [
          "Class components and lifecycle methods traded for the App Router, hooks and typed data fetching",
          "Installable PWA — service worker, offline caching, install prompts",
          "Developer portal where local publishers submit apps and track releases",
          "AI-powered features shipped on top of the store itself",
          "Hosts dozens of Iran's most-used apps: Snapp, Digikala, Divar",
        ],
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
        featured: true,
        context: "Product",
        logo: "/images/sibirani-96.png",
      },
      {
        title: "Sib Bazar",
        description:
          "The sister iOS store, running on an in-house Adhoc signing pipeline so apps install without an Apple ID — with its own dashboard where publishers watch a build move from upload to signed release.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
        context: "Product",
      },
      {
        title: "Brookli",
        description:
          "A calorie tracker that installs straight from the browser — log meals, follow daily nutrition goals, and keep using it offline, with no app-store download in the way.",
        stack: ["React", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
        context: "Product",
        logo: "/images/brookli-96.png",
      },
      {
        title: "Face Age",
        description:
          "Estimates apparent age and skin condition from a single webcam frame. MediaPipe landmark inference runs entirely in the browser, so nobody's face ever leaves their device.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
        context: "Product",
        logo: "/images/faceage-96.png",
      },
      {
        title: "Weather",
        description:
          "A React Native app built in clean architecture — each feature split into data, domain and presentation layers behind a DI container. Forecasts, air quality and severe-weather alerts stay readable offline through queries persisted in MMKV and SQLite.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
        context: "Open source",
      },
      {
        title: "Door Lock Shop",
        description:
          "A Persian RTL storefront for locks and door hardware on Next.js 16 and Payload CMS 3. A typed service layer sits between them, so the UI never queries the CMS directly and the whole stack comes up with one Docker command.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://github.com/2az2000/door-lock-shop",
        context: "Open source",
      },
      {
        title: "fabioCoffee",
        description:
          "A full-stack café system — a Next.js ordering menu and admin panel over an Express, Prisma and PostgreSQL API with JWT authentication.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
        context: "Open source",
      },
    ],
  },
  caseStudies: {
    heading: "Case Studies",
    subheading: "From the problem to what actually shipped.",
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
      {
        title: "Sib Bazar",
        tagline: "An iOS store that installs apps without an Apple ID.",
        role: "Frontend Developer",
        problem:
          "Iranian iPhone users can't reach the App Store, and local publishers had no dependable way to get a signed build onto their devices.",
        approach:
          "Built the storefront and the publisher dashboard on top of an in-house Adhoc signing pipeline, surfacing each build's path from upload through signing to public release, and reused the PWA and component foundations already proven on Sib Irani.",
        result:
          "A working iOS distribution channel where users install straight from the browser and publishers follow a release end to end without leaving the dashboard.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "Face Age",
        tagline: "Facial analysis that never uploads your face.",
        role: "Frontend Developer — Sib Irani",
        problem:
          "Estimating apparent age and skin condition means processing someone's face — the data users are least willing to hand to a server, and the slowest thing to round-trip over a weak connection.",
        approach:
          "Ran MediaPipe face-landmark inference directly against the webcam stream in the browser, so frames are analysed on the device and never leave it, and tuned model loading so the first estimate lands without a visible wait.",
        result:
          "An in-browser facial-analysis product shipped inside the Sib Irani ecosystem, with no image of a user's face ever leaving their device.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
      },
      {
        title: "Weather",
        tagline: "A React Native app built to survive a bad connection.",
        role: "Solo — architecture and implementation",
        problem:
          "A weather app is least useful exactly when the network is worst, and a React Native codebase that grows feature by feature flattens into an undifferentiated pile of screens and hooks.",
        approach:
          "Split every feature into data, domain and presentation layers resolved through a DI container, over one shared core for networking, caching, storage, logging and i18n — then persisted the TanStack Query cache into MMKV and SQLite so reads survive going offline.",
        result:
          "Seven feature slices — weather, air quality, alerts, locations, maps, recommendations and settings — sharing a single core, fully bilingual in Persian and English, with forecasts still readable on no connection.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
      },
      {
        title: "Door Lock Shop",
        tagline: "A Persian RTL catalogue non-technical staff can actually run.",
        role: "Solo — architecture and implementation",
        problem:
          "A hardware catalogue has to be editable by people who don't write code, but wiring a CMS straight into page components means every schema change ripples out through the UI — and a Persian storefront has to be right-to-left everywhere, not just translated.",
        approach:
          "Put Next.js 16 over Payload CMS 3 on Postgres, with a typed service layer as the single data-access path so no component ever queries the CMS directly, and packaged the whole stack — database included — behind one Docker Compose command with a seeding script.",
        result:
          "An RTL storefront where staff manage categories, brands and products from the admin panel, with sitemap, robots and metadata generated, and a fresh clone running locally in a single command.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://github.com/2az2000/door-lock-shop",
      },
      {
        title: "fabioCoffee",
        tagline: "One café system serving both the customer and the counter.",
        role: "Solo — full stack",
        problem:
          "A café menu and the panel staff use to maintain it are usually built as two disconnected things, which is how a product ends up live on the site after it has already been taken off the menu.",
        approach:
          "Built both against one schema: a Next.js frontend carrying the ordering menu and the admin panel, over an Express API with Prisma on PostgreSQL, with JWT auth drawing the line between customer and staff access.",
        result:
          "A single full-stack system where an edit made behind the counter is the same record the ordering menu reads, rather than a second copy that has to be kept in sync.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
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
      company: "Sib Irani",
      role: "Senior Frontend Developer",
    },
    {
      hash: "d1bc93e",
      message: "Developed Face Age using webcam & Mediapipe integration",
      date: "2025",
      company: "Sib Irani",
      role: "Senior Frontend Developer",
    },
    {
      hash: "91ea0fd",
      message: "Built scalable dashboards for the Developer Platform",
      date: "2024",
      company: "Sib Irani",
      role: "Frontend Developer",
    },
    {
      hash: "74c8fa1",
      message: "Shipped Brookli, a calorie-tracking progressive web app",
      date: "2024",
      company: "Sib Irani",
      role: "Frontend Developer",
    },
    {
      hash: "5be20f7",
      message: "Managed staging releases and CI/CD workflow",
      date: "2024",
      company: "Sib Irani",
      role: "Frontend Developer",
    },
    {
      hash: "ab4329d",
      message: "Created a reusable React architecture and shared components",
      date: "2024",
      company: "Sib Irani",
      role: "Frontend Developer",
    },
    {
      hash: "4fd80a2",
      message: "Optimized rendering, API flow and application performance",
      date: "2024",
      company: "Sib Irani",
      role: "Frontend Developer",
    },
    {
      hash: "7ac52bf",
      message: "Started professional frontend engineering journey",
      date: "2023",
      company: "Amatis Dana Tech",
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
    sending: "sending...",
    success: "message sent — I'll get back to you soon.",
    errorGeneric: "something went wrong — please email me directly.",
    log: {
      validating: "> validating --name --email --message",
      request: "> POST /api/contact",
      delivered: "✓ delivered in {ms}ms",
      failed: "✗ failed after {ms}ms",
    },
    email: "amirali.zand79@gmail.com",
    github: "https://github.com/2az2000",
    linkedin: "https://linkedin.com/in/TODO",
    resume: {
      eyebrow: "Resume",
      title: "Amirali Zand",
      meta: "PDF · A4",
      action: "Preview resume",
      dialogTitle: "Resume",
      dialogDescription: "Amirali Zand — Frontend Developer · updated 2026",
      openInNewTab: "Open in new tab",
      download: "Download PDF",
      close: "Close",
      documentUrl: "/resume/amirali-zand-resume.html",
      pdfUrl: "/resume/Amirali-Zand-Resume.pdf",
      pdfFileName: "Amirali-Zand-Resume.pdf",
    },
  },
  footer: {
    command: "amirali@portfolio:~$ cat colophon",
    keys: {
      framework: "framework",
      built: "built",
      type: "typefaces",
      fonts: "delivery",
      motion: "motion",
    },
    values: {
      selfHosted: "self-hosted — no third-party font CDN",
    },
    rights: "Designed and built by Amirali Zand.",
    source: "Source on GitHub",
  },
  palette: {
    title: "Command palette",
    description: "Search sections, projects and case studies, or run an action.",
    placeholder: "Search or jump to…",
    empty: "Nothing matches that.",
    groups: {
      navigate: "Go to",
      projects: "Projects",
      caseStudies: "Case studies",
      actions: "Actions",
    },
    actions: {
      themeToLight: "Switch to light mode",
      themeToDark: "Switch to dark mode",
      language: "خواندن به فارسی",
      xrayOn: "Turn on X-ray mode",
      xrayOff: "Turn off X-ray mode",
      xrayHint: "Outline every region with the file that renders it",
      copyEmail: "Copy email address",
      copied: "Copied to clipboard",
      resume: "Download resume (PDF)",
    },
    hints: {
      navigate: "navigate",
      select: "select",
      close: "close",
    },
  },
  xray: {
    hint: "inspect this page",
    title: "X-ray mode",
    description:
      "Every region outlined with the file that renders it, and the technique behind it.",
    exit: "Press X or Esc to exit",
    close: "Close",
    regionsLabel: "Regions on the page",
    behavioralLabel: "No outline — these are behaviour, not layout",
    regions: {
      navbar: "Sliding pill indicator on Framer Motion's layoutId, plus an IntersectionObserver scrollspy.",
      hero: "GSAP fade-and-rise stagger. The three stats are computed from the data further down the page, never typed by hand.",
      marquee: "One Framer motion value driven every frame, so hover eases the strip to a stop and you can drag to scrub it.",
      about: "Per-word scramble-decrypt on hover; the rest of the paragraph dims to keep the hovered word the subject.",
      skills: "SVG constellation — hovering a node lights its edges and dims the rest. Each node has its own magnetic pull.",
      projects: "GSAP ScrollTrigger.batch with a spring scale-pop, over an asymmetric bento where the flagship takes 2x2.",
      caseStudies: "Radix tabs, panels force-mounted so all three studies stay in the HTML for crawlers.",
      experience: "Scroll-scrubbed alternating slide, with a progress beam whose position ignites each commit node as it passes.",
      contact: "A real form dressed as a terminal session — the flags are the field labels, and the timings it prints are measured around the actual request.",
      footer: "Build facts inlined at compile time, so the version and date belong to the bundle you're running.",
    },
    behavioral: {
      cursor: "Two springs: a hard dot that tracks exactly, and a ring that snaps onto whatever you can click, matching its shape.",
      curtain: "Language switches under cover — the dictionary and text direction flip only while the page is fully hidden.",
      smoothScroll: "Lenis running off GSAP's ticker, so the whole site shares one animation frame and no scroll effect lags a frame behind.",
      reveal: "One shared entrance hook for every section, so nothing on this page enters with an ease that doesn't match the rest.",
    },
  },
};
