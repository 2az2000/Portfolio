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
    /**
     * Heading above the before → after table. Rendered only for the studies
     * that carry a `migration` array — i.e. the refactors.
     */
    migrationLabel: string;
    /** Heading above the "built once the refactor landed" list. */
    shippedLabel: string;
    viewLive: string;
    items: {
      title: string;
      tagline: string;
      role: string;
      problem: string;
      approach: string;
      result: string;
      /**
       * The version jump at the centre of a refactor, as rows of
       * label / before / after. Optional, and deliberately so: on a study
       * that isn't a migration there is nothing honest to put here, and an
       * empty table would be worse than no table.
       */
      migration?: { label: string; from: string; to: string }[];
      /**
       * What was built *after* the refactor landed — the part a version table
       * can't show. Optional for the same reason as `migration`.
       */
      shipped?: string[];
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
    subtitle: "Frontend Developer · React, Next.js, TypeScript and the Node.js ecosystem.",
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
    body: "I'm a frontend developer based in Tehran. Most of my work has gone into things people use daily: an alternative app store, a few PWAs that install straight from the browser, and AI features that run on the user's own device instead of a server. I mostly work with React, Next.js and TypeScript. What I care about is simple: the page should load fast, keep working on a bad connection, and the interface should answer when someone clicks.",
  },
  skills: {
    heading: "Skills",
    subheading: "Where these tools actually connect.",
  },
  projects: {
    heading: "Projects",
    subheading: "Things that reached real users, and code I've put in the open.",
    items: [
      {
        title: "Sib Irani",
        description:
          "Iran's alternative app store for iOS and Android, distributing lightweight WebView apps without an Apple ID. The old codebase was built on React class components; I rebuilt the whole frontend from scratch in Next.js and TypeScript.",
        highlights: [
          "App Router, hooks and typed data fetching in place of class components and lifecycle methods",
          "Installable PWA with a service worker, offline caching and install prompts",
          "Developer portal where local publishers submit apps and track releases",
          "A few AI features, on the store itself",
          "Hundreds of apps and 5M users, with Snapp, Digikala and Divar among them",
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
          "The iPhone side of Sib Irani. It runs on an in-house Adhoc signing pipeline so apps install without an Apple ID, and publishers get a dashboard showing where their build is between upload and release.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
        context: "Product",
      },
      {
        title: "Brookli",
        description:
          "A calorie tracker that installs straight from the browser. Photograph your plate or just say what you ate and the meal gets logged, offline included. I debugged the app end to end and moved it from React 18 and Material UI 4 to React 19 and MUI 9.",
        stack: ["React 19", "MUI 9", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
        context: "Product",
        logo: "/images/brookli-96.png",
      },
      {
        title: "Face Age",
        description:
          "Estimates apparent age and skin condition from a single webcam frame. MediaPipe landmark inference runs inside the browser, so nobody's face leaves their device.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
        context: "Product",
        logo: "/images/faceage-96.png",
      },
      {
        title: "Weather",
        description:
          "A React Native app in clean architecture. Each feature is split into data, domain and presentation layers behind a DI container, and forecasts, air quality and alerts stay readable offline through queries cached in MMKV and SQLite.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
        context: "Open source",
      },
      {
        title: "Door Lock Shop",
        description:
          "A Persian RTL storefront for locks and door hardware, on Next.js 16 and Payload CMS 3. A typed service layer sits between them so the UI never queries the CMS directly, and the whole stack comes up with one Docker command.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://doorlock-shop.vercel.app/",
        context: "Open source",
      },
      {
        title: "fabioCoffee",
        description:
          "A full-stack café system. A Next.js ordering menu and admin panel over an Express, Prisma and PostgreSQL API with JWT authentication.",
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
    migrationLabel: "Versions, before and after",
    shippedLabel: "Added after the refactor",
    viewLive: "View live",
    items: [
      {
        title: "Sib Irani",
        tagline: "Rebuilding an Iranian app store's frontend from scratch.",
        role: "Frontend Developer · rebuilt the Next.js frontend",
        problem:
          "The old frontend couldn't cover what we needed next. We wanted full PWA support and a developer portal that was growing fast, and adding both to the old code would have taken longer than rewriting it.",
        approach:
          "I rewrote the frontend from scratch in Next.js, built full PWA support with install prompts and offline caching, added several AI features, and worked with the backend, design and product teams on the developer portal. Performance and code structure got cleaned up along the way.",
        result:
          "A codebase that is faster and easier to maintain, now running one of Iran's alternative app stores: hundreds of apps, 5M users, Snapp and Digikala and Divar among them, and an active developer portal.",
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
      },
      {
        title: "Brookli",
        tagline:
          "Debugging a live calorie tracker, then moving it from React 18 and MUI 4 to React 19 and MUI 9.",
        role: "Frontend Developer · led the refactor",
        problem:
          "Brookli worked, but it was stuck on Material UI 4, which still runs on JSS and makeStyles and is several majors behind the ecosystem. That one pin locked the whole dependency tree: React couldn't go past 18, current libraries wouldn't install cleanly next to it, and every new feature took longer than it should. There was also a backlog of bugs nobody wanted to touch while the code was in that state.",
        approach:
          "I emptied the bug backlog first, so that nothing old could later be blamed on anything new, and built the features on top of that: meal logging from a photo and by voice. The dependency migration came last, in steps rather than one commit: packages renamed from @material-ui to @mui, every makeStyles and withStyles block rewritten with styled and sx in Emotion, the theme moved up one major at a time to 9, and React last, to 19, dropping findDOMNode and defaultProps and taking refs as ordinary props.",
        result:
          "The app now runs on current React and MUI, the bug backlog is empty, meal logging by photo and by voice is in, and the PWA stayed installable and offline the whole way through.",
        migration: [
          { label: "React", from: "18", to: "19" },
          { label: "Material UI", from: "4", to: "9" },
          { label: "Package name", from: "@material-ui/core", to: "@mui/material" },
          { label: "Styling", from: "JSS · makeStyles", to: "Emotion · styled + sx" },
        ],
        shipped: [
          "Photo meal logging: point the camera at your plate and the form fills itself",
          "Voice meal logging: say what you ate and it saves as the same record",
          "Clearing the bug backlog first, before any of the new work went in",
          "The PWA stayed installable and offline throughout, service worker and cache untouched",
        ],
        stack: ["React 19", "MUI 9", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
      },
      {
        title: "Sib Bazar",
        tagline: "An iOS store that installs apps without an Apple ID.",
        role: "Frontend Developer",
        problem:
          "Iranian iPhone users can't reach the App Store, and local publishers had no dependable way to get a signed build onto their devices.",
        approach:
          "I built the storefront and the publisher dashboard on top of an in-house Adhoc signing pipeline, so each build's path from upload through signing to release is visible in the dashboard. The PWA groundwork and components that already worked on Sib Irani got reused.",
        result:
          "An iOS distribution channel where users install straight from the browser and publishers follow a release end to end from the dashboard.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "Face Age",
        tagline: "Face analysis without uploading a photo.",
        role: "Frontend Developer · Sib Irani",
        problem:
          "Estimating apparent age and skin condition means processing someone's face: the most sensitive data you can ask for, and the heaviest thing to round-trip over a weak connection.",
        approach:
          "I ran MediaPipe face-landmark inference directly on the webcam stream in the browser, so frames are analysed on the device and never leave it, and tuned model loading so the first result arrives without a noticeable wait.",
        result:
          "An in-browser face analysis product shipped inside the Sib Irani ecosystem, with no image ever leaving the user's device.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
      },
      {
        title: "Weather",
        tagline: "A React Native app that works on a bad connection.",
        role: "Solo · architecture and implementation",
        problem:
          "A weather app is usually needed exactly when the network is worst. And a React Native codebase that grows feature by feature turns into a mess after a while.",
        approach:
          "I split each feature into data, domain and presentation layers resolved through a DI container, over one shared core for networking, caching, storage, logging and i18n. The TanStack Query cache is persisted to MMKV and SQLite so there is still data offline.",
        result:
          "Seven feature slices (weather, air quality, alerts, locations, maps, recommendations, settings) on one shared core, bilingual in Persian and English, with forecasts that still open with no connection.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
      },
      {
        title: "Door Lock Shop",
        tagline: "A catalogue someone non-technical can actually run.",
        role: "Solo · architecture and implementation",
        problem:
          "The shop's content has to be editable by someone who doesn't write code. But wiring the CMS straight into page components means every schema change reaches the UI, and a Persian storefront has to genuinely be right-to-left, not just translated.",
        approach:
          "I put Next.js 16 on top of Payload CMS 3 and Postgres, with a typed service layer as the only path to data, so no component queries the CMS directly. The whole stack, database included, is packed behind one Docker Compose command and a seed script.",
        result:
          "A storefront where the team manages categories, brands and products from the admin panel, with sitemap, robots and metadata generated, and a fresh clone that comes up with one command.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://doorlock-shop.vercel.app/",
      },
      {
        title: "fabioCoffee",
        tagline: "One café system for the customer and the counter.",
        role: "Solo · full stack",
        problem:
          "A café menu and the panel staff maintain it with are usually built as two separate things. That is how a product stays live on the site after it has been taken off the menu.",
        approach:
          "I built both on one schema: a Next.js frontend carrying the ordering menu and the admin panel, over an Express API with Prisma on PostgreSQL, with JWT separating customer and staff access.",
        result:
          "An edit made behind the counter is the same record the ordering menu reads. There is no second copy to keep in sync.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
      },
    ],
  },
  experience: {
    heading: "Experience",
    subheading: "The track record, as a commit log.",
    items: [
      {
        hash: "3e91c07",
        message: "Refactored Brookli to React 19 & MUI 9, and shipped AI meal logging",
        date: "2026",
        company: "Sib Irani",
        role: "Senior Frontend Developer",
      },
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
        date: "2025",
        company: "Sib Irani",
        role: "Frontend Developer",
      },
      {
        hash: "74c8fa1",
        message: "Shipped Brookli, a calorie-tracking progressive web app",
        date: "2025",
        company: "Sib Irani",
        role: "Frontend Developer",
      },
      {
        hash: "5be20f7",
        message: "Managed staging releases and CI/CD workflow",
        date: "2025",
        company: "Sib Irani",
        role: "Frontend Developer",
      },
      {
        hash: "ab4329d",
        message: "Created a reusable React architecture and shared components",
        date: "2025",
        company: "Sib Irani",
        role: "Frontend Developer",
      },
      {
        hash: "4fd80a2",
        message: "Optimized rendering, API flow and application performance",
        date: "2025",
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
    subheading: "Available for new work or collaboration.",
    fieldName: "--name",
    fieldEmail: "--email",
    fieldMessage: "--message",
    submit: "run send.sh",
    sending: "sending...",
    success: "message received. I'll get back to you soon.",
    errorGeneric: "something went wrong. please email me directly.",
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
      dialogDescription: "Amirali Zand · Frontend Developer · updated 2026",
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
      selfHosted: "served from this domain, no font CDN",
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
    behavioralLabel: "No outline, because these are behaviour rather than layout",
    regions: {
      navbar:
        "Sliding pill indicator on Framer Motion's layoutId, plus an IntersectionObserver scrollspy.",
      hero: "GSAP fade-and-rise stagger. The three stats are computed from the data further down the page, not typed by hand.",
      marquee:
        "One Framer motion value driven every frame, so hover eases the strip to a stop and you can drag to scrub it.",
      about:
        "Per-word scramble-decrypt on hover; the rest of the paragraph dims to keep the hovered word the subject.",
      skills:
        "SVG constellation. Hovering a node lights its edges and dims the rest, and each node has its own magnetic pull.",
      projects:
        "ScrollTrigger.batch, so each card enters as it crosses the line, over an asymmetric bento where the flagship takes 2x2.",
      caseStudies:
        "Radix tabs, panels force-mounted so every study stays in the HTML for crawlers.",
      experience:
        "Scroll-scrubbed alternating slide, with a progress beam whose position ignites each commit node as it passes.",
      contact:
        "A real form in terminal clothing. The flags are the field labels, and the timings it prints are measured around the actual request.",
      footer:
        "Build facts inlined at compile time, so the version and date belong to the bundle you're running.",
    },
    behavioral: {
      cursor:
        "Two springs: a hard dot that tracks exactly, and a ring that snaps onto whatever you can click, matching its shape.",
      curtain:
        "Language switches under cover: the dictionary and text direction flip only while the page is fully hidden.",
      smoothScroll:
        "Lenis running off GSAP's ticker, so the whole site shares one animation frame and no scroll effect lags a frame behind.",
      reveal: "One shared entrance hook for every section, so the sections all enter in step.",
    },
  },
};
