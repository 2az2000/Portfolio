import type { Dictionary } from "./en";

export const fa: Dictionary = {
  nav: {
    about: "درباره من",
    skills: "مهارت‌ها",
    projects: "پروژه‌ها",
    caseStudies: "کیس‌استادی",
    experience: "سوابق",
    contact: "تماس",
  },
  hero: {
    eyebrow: "// رابط‌هایی می‌سازم که واقعاً پاسخ می‌دهند",
    title: "امیرعلی زند",
    subtitle: "Frontend Developer — React، Next.js، TypeScript و اکوسیستم Node.js",
    ctaPrimary: "مشاهده پروژه‌ها",
    ctaSecondary: "تماس با من",
  },
  about: {
    heading: "درباره من",
    body: "من یک فرانت‌اند دولوپر هستم که معتقدم بهترین رابط‌های کاربری، آن‌هایی هستند که زنده به نظر می‌رسند. با تمرکز روی React، Next.js و TypeScript، اپلیکیشن‌هایی می‌سازم که فقط کار نمی‌کنند — پاسخ می‌دهند، تطبیق می‌کنند و غافلگیر می‌کنند. هر پیکسل، هر انیمیشن و هر تعامل کوچک، عمدی است. من کد نمی‌نویسم تا یک صفحه را پر کنم؛ تجربه‌هایی می‌سازم که مهارت را ثابت می‌کنند.",
  },
  skills: {
    heading: "مهارت‌ها",
    subheading: "اینکه تکنولوژی‌ها چطور به هم وصل‌اند، نه فقط یک لیست.",
  },
  projects: {
    heading: "پروژه‌ها",
    subheading: "چند نمونه از کارهایی که ساخته‌ام.",
    items: [
      {
        title: "سیب ایرانی",
        description:
          "اپ‌استور جایگزین ایرانی که اپلیکیشن‌های سبک و وب‌ویو-محور رو برای iOS و اندروید، بدون نیاز به Apple ID توزیع می‌کنه — همراه با پنل توسعه‌دهنده برای ناشران ایرانی.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibirani.com",
        featured: true,
      },
      {
        title: "سیب بازار",
        description:
          "پلتفرم اپ‌استور خواهرِ سیب ایرانی برای کاربران آیفون، با پایپ‌لاین توزیع اختصاصی Adhoc و داشبورد توسعه‌دهنده‌ی مجزا.",
        stack: ["React", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "بروکلی",
        description:
          "پروگرسیو وب‌اپ برای ثبت وعده‌های غذایی و پیگیری اهداف روزانه‌ی تغذیه.",
        stack: ["React", "PWA"],
        href: "https://app.brookliapp.com/",
      },
      {
        title: "fabioCoffee",
        description:
          "یک سیستم مدیریت کافه‌ی full-stack — منوی سفارش‌گیری و پنل ادمین با Next.js، متصل به یک API مبتنی بر Express/Prisma/PostgreSQL با احراز هویت JWT.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
      },
      {
        title: "smartShop",
        description:
          "یک فروشگاه آنلاین Next.js با احراز هویت Clerk، کاتالوگ محصولات مبتنی بر Prisma، و لایه‌ی کامپوننت shadcn/ui.",
        stack: ["Next.js", "Clerk", "Prisma"],
        href: "https://github.com/2az2000/smartShop",
      },
      {
        title: "saghfino",
        description:
          "پلتفرم اجاره و خرید ملک مبتنی بر نقشه برای مرور آگهی‌ها بر اساس موقعیت مکانی، ساخته‌شده با React، Vite و Leaflet.",
        stack: ["React", "Vite", "Leaflet"],
        href: "https://github.com/2az2000/saghfino",
      },
    ],
  },
  caseStudies: {
    heading: "کیس‌استادی",
    subheading: "دو پروژه، از مسئله تا چیزی که نهایتاً شیپ شد.",
    problemLabel: "مسئله",
    approachLabel: "رویکرد",
    resultLabel: "نتیجه",
    viewLive: "مشاهده‌ی نسخه‌ی زنده",
    items: [
      {
        title: "سیب ایرانی",
        tagline: "بازنویسی کامل نسخه‌ی Next.js یک اپ‌استور جایگزین ایرانی، از صفر.",
        role: "Frontend Developer — بازنویسی کامل نسخه‌ی Next.js از صفر",
        problem:
          "فرانت‌اند قبلی سیب ایرانی نیاز به بازسازی کامل داشت تا از قابلیت‌های جدید PWA و رشد پنل توسعه‌دهندگان پشتیبانی کنه؛ برای همین نسخه‌ی Next.js از صفر بازنویسی شد.",
        approach:
          "فرانت‌اند Next.js رو از صفر بازنویسی کردم، قابلیت‌های کامل PWA (نصب‌پذیری، کش آفلاین) رو پیاده‌سازی کردم، چند فیچر مبتنی بر هوش مصنوعی شیپ کردم، و برای انتشار پایدار پنل توسعه‌دهندگان با تیم‌های بک‌اند، طراحی و محصول هماهنگ بودم — همراه با بهینه‌سازی مداوم پرفورمنس و ساختار کد.",
        result:
          "یک کدبیس Next.js سریع‌تر و قابل‌نگه‌داری‌تر که الان یکی از اپ‌استورهای جایگزین ایرانی رو اداره می‌کنه — با ده‌ها اپ محبوب ایرانی (اسنپ، دیجی‌کالا، دیوار و بیشتر) و یک پنل توسعه‌دهندگان فعال.",
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
      },
      {
        title: "بروکلی",
        tagline: "یک پروگرسیو وب‌اپ ثبت کالری که مستقیم از مرورگر نصب می‌شه.",
        role: "Frontend Developer",
        problem:
          "بروکلی نیاز به یک تجربه‌ی سبک و نصب‌پذیر برای پیگیری کالری داشت که روی همه‌ی دستگاه‌ها به‌صورت PWA قابل‌اعتماد کار کنه، بدون سربار یک اپ نیتیو.",
        approach:
          "زیرساخت PWA (نصب، کش آفلاین، service worker) رو پیاده‌سازی کردم، فیچرهای مبتنی بر هوش مصنوعی شیپ کردم، با تیم محصول/طراحی روی فلوی ثبت وعده‌های غذایی هماهنگ بودم، و پرفورمنس رندر رو در سراسر اپ بهینه کردم.",
        result:
          "یک PWA پایدار و نصب‌پذیر که کاربران می‌تونن وعده‌های غذایی و کالری‌شون رو مستقیم از مرورگر پیگیری کنن — بدون نیاز به دانلود از اپ‌استور.",
        stack: ["React", "PWA"],
        href: "https://app.brookliapp.com/",
      },
    ],
  },
experience: {
  heading: "سوابق کاری",
  subheading: "جایی که کامیت‌ها واقعاً اتفاق افتادن.",
  items: [
    {
      hash: "f8a21d4",
      message: "بازنویسی کامل فروشگاه سیب ایرانی با Next.js و TypeScript",
      date: "۱۴۰۴",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "d1bc93e",
      message: "توسعه محصول هوش مصنوعی Face Age با Webcam و Mediapipe",
      date: "۱۴۰۴",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "91ea0fd",
      message: "توسعه داشبوردهای مقیاس‌پذیر Developer Platform",
      date: "۱۴۰۳",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "74c8fa1",
      message: "توسعه اپلیکیشن PWA بروکلی برای مدیریت کالری",
      date: "۱۴۰۳",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "5be20f7",
      message: "مدیریت فرآیند انتشار نسخه‌ها و CI/CD",
      date: "۱۴۰۳",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "ab4329d",
      message: "طراحی معماری کامپوننت‌های قابل استفاده مجدد در React",
      date: "۱۴۰۳",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "4fd80a2",
      message: "بهینه‌سازی رندر، ارتباط با API و افزایش Performance",
      date: "۱۴۰۳",
      company: "TODO: نام شرکت",
      role: "Frontend Developer",
    },
    {
      hash: "7ac52bf",
      message: "شروع مسیر حرفه‌ای به عنوان Frontend Engineer",
      date: "۱۴۰۲",
      company: "TODO: نام شرکت",
      role: "Junior Frontend Developer",
    },
  ],
},
  contact: {
    heading: "بیایید صحبت کنیم",
    subheading: "برای فرصت‌ها و همکاری‌های جدید در دسترسم.",
    fieldName: "--name",
    fieldEmail: "--email",
    fieldMessage: "--message",
    submit: "run send.sh",
    email: "TODO@example.com",
    github: "https://github.com/2az2000",
    linkedin: "https://linkedin.com/in/TODO",
  },
};
