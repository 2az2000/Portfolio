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
    stats: {
      years: "سال تجربه",
      projects: "پروژه شیپ‌شده",
      caseStudies: "کیس‌استادی",
    },
    scrollCue: "اسکرول",
    rail: {
      now: "در حال حاضر",
      localTime: "ساعت محلی",
      city: "تهران",
      latest: "آخرین انتشار",
      links: "دسترسی سریع",
      github: "گیت‌هاب",
      email: "ایمیل",
    },
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
    subheading: "محصول‌هایی که دست کاربر واقعی‌اند، و کدی که در فضای باز می‌نویسم.",
    items: [
      {
        title: "سیب ایرانی",
        description:
          "اپ‌استور جایگزین ایرانی برای iOS و اندروید، که اپلیکیشن‌های سبک وب‌ویو-محور رو بدون نیاز به Apple ID توزیع می‌کنه. یک کدبیس React کلاس‌محور رو تحویل گرفتم و کل فرانت‌اند رو از صفر با Next.js و TypeScript بازنویسی کردم.",
        highlights: [
          "کامپوننت‌های کلاسی و lifecycle، جای خودشون رو به App Router، هوک‌ها و دیتافچینگ تایپ‌دار دادن",
          "PWA نصب‌شدنی — سرویس‌ورکر، کش آفلاین و install prompt",
          "پنل توسعه‌دهنده برای ثبت اپ و پیگیری انتشار توسط ناشران ایرانی",
          "چند قابلیت مبتنی بر هوش مصنوعی، روی خودِ استور",
          "میزبان ده‌ها اپ پرکاربرد ایرانی: اسنپ، دیجی‌کالا، دیوار",
        ],
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
        featured: true,
        context: "محصول",
        logo: "/images/sibirani-96.png",
      },
      {
        title: "سیب بازار",
        description:
          "اپ‌استور خواهرِ سیب ایرانی برای آیفون، با پایپ‌لاین امضای Adhoc اختصاصی که نصب بدون Apple ID رو ممکن می‌کنه — و داشبورد مجزایی که ناشر توش مسیر یک بیلد رو از آپلود تا انتشارِ امضاشده دنبال می‌کنه.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
        context: "محصول",
      },
      {
        title: "بروکلی",
        description:
          "کالری‌شمار که مستقیم از مرورگر نصب می‌شه — ثبت وعده‌های غذایی، پیگیری اهداف روزانه‌ی تغذیه، و کارکردن آفلاین، بدون اینکه دانلود از اپ‌استور وسط راه بایسته.",
        stack: ["React", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
        context: "محصول",
        logo: "/images/brookli-96.png",
      },
      {
        title: "Face Age",
        description:
          "سن ظاهری و وضعیت پوست رو از روی یک فریم وبکم تخمین می‌زنه. پردازش لندمارک‌های MediaPipe کاملاً داخل مرورگر اجرا می‌شه، پس تصویر چهره‌ی هیچ‌کس از دستگاهش بیرون نمی‌ره.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
        context: "محصول",
        logo: "/images/faceage-96.png",
      },
      {
        title: "Weather",
        description:
          "اپ ری‌اکت‌نیتیو با معماری تمیز — هر فیچر به لایه‌های data، domain و presentation تقسیم شده و پشت یک کانتینر DI نشسته. پیش‌بینی هوا، کیفیت هوا و هشدارهای جوی با کوئری‌های ذخیره‌شده در MMKV و SQLite آفلاین هم در دسترسن.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
        context: "متن‌باز",
      },
      {
        title: "Door Lock Shop",
        description:
          "فروشگاه راست‌به‌چپ قفل و یراق‌آلات در، روی Next.js 16 و Payload CMS 3. یک لایه‌ی سرویس تایپ‌دار بینشون نشسته تا رابط کاربری هیچ‌وقت مستقیم از CMS کوئری نگیره، و کل استک با یک دستور Docker بالا میاد.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://github.com/2az2000/door-lock-shop",
        context: "متن‌باز",
      },
      {
        title: "fabioCoffee",
        description:
          "سیستم مدیریت کافه‌ی full-stack — منوی سفارش‌گیری و پنل ادمین با Next.js، روی API‌ای از جنس Express، Prisma و PostgreSQL با احراز هویت JWT.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
        context: "متن‌باز",
      },
    ],
  },
  caseStudies: {
    heading: "کیس‌استادی",
    subheading: "از مسئله تا چیزی که نهایتاً شیپ شد.",
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
      {
        title: "سیب بازار",
        tagline: "اپ‌استوری برای آیفون که اپ‌ها رو بدون Apple ID نصب می‌کنه.",
        role: "Frontend Developer",
        problem:
          "کاربران آیفون در ایران به App Store دسترسی ندارن، و ناشران محلی هم راه قابل‌اتکایی نداشتن که یک بیلد امضاشده رو روی دستگاه کاربر برسونن.",
        approach:
          "فروشگاه و داشبورد ناشر رو روی یک پایپ‌لاین امضای Adhoc داخلی ساختم، طوری که مسیر هر بیلد از آپلود تا امضا و انتشار عمومی توی داشبورد دیده بشه، و از همون زیرساخت PWA و لایه‌ی کامپوننتی که روی سیب ایرانی جواب داده بود دوباره استفاده کردم.",
        result:
          "یک کانال توزیع iOS که کاربر مستقیم از مرورگر نصب می‌کنه و ناشر کل مسیر انتشار رو بدون خروج از داشبورد دنبال می‌کنه.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "Face Age",
        tagline: "تحلیل چهره‌ای که هیچ‌وقت تصویر صورتت رو آپلود نمی‌کنه.",
        role: "Frontend Developer — سیب ایرانی",
        problem:
          "تخمین سن ظاهری و وضعیت پوست یعنی پردازش چهره‌ی کاربر — همون داده‌ای که کاربر کمتر از هر چیزی حاضره به سرور بسپره، و کندترین چیزی که می‌شه روی یک اتصال ضعیف رفت‌وبرگشت داد.",
        approach:
          "پردازش لندمارک‌های چهره‌ی MediaPipe رو مستقیم روی استریم وبکم و داخل مرورگر اجرا کردم، طوری که فریم‌ها روی خود دستگاه تحلیل بشن و هیچ‌وقت ازش بیرون نرن، و بارگذاری مدل رو طوری تنظیم کردم که اولین تخمین بدون انتظار محسوس برسه.",
        result:
          "یک محصول تحلیل چهره‌ی درون‌مرورگری که در اکوسیستم سیب ایرانی شیپ شد، بدون اینکه حتی یک تصویر از چهره‌ی کاربر از دستگاهش خارج بشه.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
      },
      {
        title: "Weather",
        tagline: "اپ ری‌اکت‌نیتیوی که ساخته شده تا از پس اتصال بد بربیاد.",
        role: "انفرادی — معماری و پیاده‌سازی",
        problem:
          "اپ هواشناسی دقیقاً وقتی بی‌فایده می‌شه که شبکه بدترین حالتش رو داره، و کدبیس ری‌اکت‌نیتیوی که فیچر به فیچر رشد کنه، به یک توده‌ی یکدست از صفحه‌ها و هوک‌ها تبدیل می‌شه.",
        approach:
          "هر فیچر رو به لایه‌های data، domain و presentation شکستم که از طریق یک کانتینر DI حل می‌شن، روی یک core مشترک برای شبکه، کش، استوریج، لاگ و i18n — و بعد کش TanStack Query رو توی MMKV و SQLite ماندگار کردم تا خوندن داده‌ها آفلاین هم کار کنه.",
        result:
          "هفت اسلایس فیچر — هوا، کیفیت هوا، هشدارها، مکان‌ها، نقشه، پیشنهادها و تنظیمات — روی یک core مشترک، کاملاً دوزبانه فارسی و انگلیسی، با پیش‌بینی‌هایی که بدون اتصال هم خونده می‌شن.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
      },
      {
        title: "Door Lock Shop",
        tagline: "کاتالوگ راست‌به‌چپی که کاربر غیرفنی هم بتونه بچرخونتش.",
        role: "انفرادی — معماری و پیاده‌سازی",
        problem:
          "کاتالوگ یراق‌آلات باید توسط آدم‌هایی ویرایش بشه که کد نمی‌نویسن، ولی وصل‌کردن مستقیم CMS به کامپوننت‌های صفحه یعنی هر تغییر اسکیما تا خود رابط کاربری موج می‌ندازه — و فروشگاه فارسی باید همه‌جا راست‌به‌چپ باشه، نه فقط ترجمه‌شده.",
        approach:
          "Next.js 16 رو روی Payload CMS 3 و Postgres نشوندم، با یک لایه‌ی سرویس تایپ‌دار به‌عنوان تنها مسیر دسترسی به داده تا هیچ کامپوننتی مستقیم از CMS کوئری نگیره، و کل استک — با دیتابیس — رو پشت یک دستور Docker Compose و یک اسکریپت seed بسته‌بندی کردم.",
        result:
          "یک فروشگاه راست‌به‌چپ که تیم از پنل ادمین دسته‌بندی و برند و محصول رو مدیریت می‌کنه، با sitemap و robots و متادیتای تولیدشده، و یک کلون تازه که با یک دستور بالا میاد.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://github.com/2az2000/door-lock-shop",
      },
      {
        title: "fabioCoffee",
        tagline: "یک سیستم کافه که هم سمت مشتری رو سرو می‌کنه هم سمت پیشخوان.",
        role: "انفرادی — full-stack",
        problem:
          "منوی کافه و پنلی که کارکنان باهاش نگهش می‌دارن معمولاً دو چیز جدا از هم ساخته می‌شن، و همین‌طوریه که محصولی روی سایت زنده می‌مونه که از منو برداشته شده.",
        approach:
          "هر دو رو روی یک اسکیما ساختم: یک فرانت‌اند Next.js که منوی سفارش‌گیری و پنل ادمین رو با هم داره، روی یک API با Express و Prisma و PostgreSQL، و احراز هویت JWT که مرز بین دسترسی مشتری و کارکنان رو می‌کشه.",
        result:
          "یک سیستم full-stack واحد که ویرایشِ پشت پیشخوان، همون رکوردیه که منوی سفارش‌گیری می‌خونه — نه یک نسخه‌ی دوم که باید هم‌گام نگه داشته بشه.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
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
      company: "سیب ایرانی",
      role: "Senior Frontend Developer",
    },
    {
      hash: "d1bc93e",
      message: "توسعه محصول هوش مصنوعی Face Age با Webcam و Mediapipe",
      date: "۱۴۰۴",
      company: "سیب ایرانی",
      role: "Senior Frontend Developer",
    },
    {
      hash: "91ea0fd",
      message: "توسعه داشبوردهای مقیاس‌پذیر Developer Platform",
      date: "۱۴۰۳",
      company: "سیب ایرانی",
      role: "Frontend Developer",
    },
    {
      hash: "74c8fa1",
      message: "توسعه اپلیکیشن PWA بروکلی برای مدیریت کالری",
      date: "۱۴۰۳",
      company: "سیب ایرانی",
      role: "Frontend Developer",
    },
    {
      hash: "5be20f7",
      message: "مدیریت فرآیند انتشار نسخه‌ها و CI/CD",
      date: "۱۴۰۳",
      company: "سیب ایرانی",
      role: "Frontend Developer",
    },
    {
      hash: "ab4329d",
      message: "طراحی معماری کامپوننت‌های قابل استفاده مجدد در React",
      date: "۱۴۰۳",
      company: "سیب ایرانی",
      role: "Frontend Developer",
    },
    {
      hash: "4fd80a2",
      message: "بهینه‌سازی رندر، ارتباط با API و افزایش Performance",
      date: "۱۴۰۳",
      company: "سیب ایرانی",
      role: "Frontend Developer",
    },
    {
      hash: "7ac52bf",
      message: "شروع مسیر حرفه‌ای به عنوان Frontend Engineer",
      date: "۱۴۰۲",
      company: "Amatis Dana Tech",
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
    sending: "در حال ارسال...",
    success: "پیام ارسال شد — به‌زودی جواب می‌دم.",
    errorGeneric: "یه مشکلی پیش اومد — لطفاً مستقیم ایمیل بزنید.",
    // Kept in Latin in both locales on purpose: these are the literal flags
    // and the literal route, the same way `run send.sh` above stays untranslated.
    // Translating "POST /api/contact" would turn a real line into a costume.
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
      eyebrow: "رزومه",
      title: "امیرعلی زند",
      meta: "PDF · A4",
      action: "مشاهده رزومه",
      dialogTitle: "رزومه",
      dialogDescription: "امیرعلی زند — Frontend Developer · بروزرسانی ۱۴۰۵",
      openInNewTab: "باز کردن در صفحه جدید",
      download: "دانلود PDF",
      close: "بستن",
      documentUrl: "/resume/amirali-zand-resume.html",
      pdfUrl: "/resume/Amirali-Zand-Resume.pdf",
      pdfFileName: "Amirali-Zand-Resume.pdf",
    },
  },
  footer: {
    command: "amirali@portfolio:~$ cat colophon",
    keys: {
      framework: "فریم‌ورک",
      built: "ساخت",
      type: "قلم‌ها",
      fonts: "تحویل",
      motion: "انیمیشن",
    },
    values: {
      selfHosted: "میزبانی روی همین دامنه — بدون CDN فونت",
    },
    rights: "طراحی و ساخت: امیرعلی زند.",
    source: "سورس روی گیت‌هاب",
  },
  palette: {
    title: "پالت دستورها",
    description: "بین بخش‌ها، پروژه‌ها و کیس‌استادی‌ها بگردید یا یک کار را اجرا کنید.",
    placeholder: "جست‌وجو یا پرش به…",
    empty: "چیزی پیدا نشد.",
    groups: {
      navigate: "برو به",
      projects: "پروژه‌ها",
      caseStudies: "کیس‌استادی‌ها",
      actions: "کارها",
    },
    actions: {
      themeToLight: "تم روشن",
      themeToDark: "تم تیره",
      // Written in the language being switched *to*, the same way the Persian
      // row reads in the English palette — the one person who needs this row
      // is the one who cannot read the language currently on screen.
      language: "Read in English",
      xrayOn: "روشن‌کردن حالت اشعه‌ایکس",
      xrayOff: "خاموش‌کردن حالت اشعه‌ایکس",
      xrayHint: "دور هر بخش، فایلی که آن را می‌سازد",
      copyEmail: "کپی آدرس ایمیل",
      copied: "کپی شد",
      resume: "دانلود رزومه (PDF)",
    },
    hints: {
      navigate: "جابه‌جایی",
      select: "انتخاب",
      close: "بستن",
    },
  },
  xray: {
    hint: "این صفحه را بشکاف",
    title: "حالت اشعه‌ایکس",
    description: "دور هر بخش، فایلی که آن را می‌سازد و تکنیک پشتش.",
    exit: "برای خروج X یا Esc",
    close: "بستن",
    regionsLabel: "بخش‌های صفحه",
    behavioralLabel: "بدون کادر — اینها رفتارند، نه چیدمان",
    regions: {
      navbar: "نشانگر لغزانِ layoutId فریمر موشن، به‌همراه اسکرول‌اسپای با IntersectionObserver.",
      hero: "ورود پلکانی محو‌و‌بالا با GSAP. هر سه عدد از داده‌های پایین همین صفحه حساب می‌شوند، نه دستی.",
      marquee: "یک motion value که هر فریم رانده می‌شود؛ برای همین با هاور نرم می‌ایستد و می‌شود کشیدش.",
      about: "رمزگشایی کلمه‌به‌کلمه روی هاور؛ باقی پاراگراف کم‌رنگ می‌شود تا کلمه‌ی زیر نشانگر موضوع بماند.",
      skills: "صورت‌فلکی SVG — هاور روی هر گره یال‌هایش را روشن و بقیه را محو می‌کند. هر گره کشش مغناطیسی خودش را دارد.",
      projects: "ScrollTrigger.batch با جهش فنری مقیاس، روی بنتوی نامتقارنی که کارت شاخص ۲×۲ می‌گیرد.",
      caseStudies: "تب‌های رادیکس، با پنل‌های force-mount تا هر سه مطالعه برای خزنده‌ها داخل HTML بمانند.",
      experience: "لغزش یک‌درمیانِ گره‌خورده به اسکرول، با پرتوی پیشرفتی که هر گره کامیت را موقع عبور روشن می‌کند.",
      contact: "یک فرم واقعی در لباس نشست ترمینال — فلگ‌ها همان برچسب فیلدها هستند و زمانی که چاپ می‌کند، دور درخواست واقعی اندازه گرفته شده.",
      footer: "اطلاعات build که موقع کامپایل داخل کد نشسته‌اند؛ پس نسخه و تاریخ، مالِ همان باندلی است که الان اجرا می‌شود.",
    },
    behavioral: {
      cursor: "دو فنر: نقطه‌ای که دقیق دنبال می‌کند و حلقه‌ای که روی هر چیز کلیک‌شدنی می‌چسبد و شکلش را می‌گیرد.",
      curtain: "زبان زیر پوشش عوض می‌شود — دیکشنری و جهت متن فقط وقتی می‌چرخند که صفحه کاملاً پوشیده است.",
      smoothScroll: "لنیس روی تیکر GSAP؛ کل سایت یک فریم مشترک دارد و هیچ افکت اسکرولی یک فریم عقب نمی‌افتد.",
      reveal: "یک هوک ورود مشترک برای همه‌ی بخش‌ها، تا هیچ چیز این صفحه با ایزی ناهماهنگ وارد نشود.",
    },
  },
};
