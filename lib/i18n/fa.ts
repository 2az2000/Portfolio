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
    eyebrow: "// رابط کاربری که سریع باز می‌شه و درست کار می‌کنه",
    title: "امیرعلی زند",
    subtitle: "Frontend Developer · React، Next.js، TypeScript و اکوسیستم Node.js",
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
    body: "فرانت‌اند دولوپرم و تهران کار می‌کنم. بیشتر وقتم صرف چیزهایی شده که آدم‌ها هر روز ازشون استفاده می‌کنن: یه اپ‌استور جایگزین، چند تا PWA که مستقیم از مرورگر نصب می‌شن، و فیچرهای هوش مصنوعی که به‌جای سرور روی دستگاه خود کاربر اجرا می‌شن. بیشتر با React و Next.js و TypeScript کار می‌کنم. چیزی که برام مهمه ساده‌ست: صفحه زود بالا بیاد، با اینترنت ضعیف هم از کار نیفته، و رابط به کلیک کاربر جواب بده.",
  },
  skills: {
    heading: "مهارت‌ها",
    subheading: "اینکه این ابزارها کجا به هم وصل می‌شن.",
  },
  projects: {
    heading: "پروژه‌ها",
    subheading: "چیزهایی که به دست کاربر رسیده، و کدی که عمومی گذاشتم.",
    items: [
      {
        title: "سیب ایرانی",
        description:
          "اپ‌استور جایگزین ایرانی برای iOS و اندروید که اپ‌های وب‌ویو-محور رو بدون Apple ID توزیع می‌کنه. کدبیس قبلی با کلاس‌کامپوننت‌های React نوشته شده بود؛ کل فرانت‌اند رو از صفر با Next.js و TypeScript بازنویسی کردم.",
        highlights: [
          "جای کلاس‌کامپوننت‌ها و lifecycle رو App Router، هوک‌ها و دیتافچینگ تایپ‌دار گرفت",
          "PWA نصب‌شدنی با سرویس‌ورکر، کش آفلاین و install prompt",
          "پنل توسعه‌دهنده برای ثبت اپ و پیگیری انتشار",
          "چند فیچر هوش مصنوعی، روی خود استور",
          "ده‌ها اپ پرکاربرد ایرانی روش هست: اسنپ، دیجی‌کالا، دیوار",
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
          "نسخه‌ی آیفونِ سیب ایرانی. یه پایپ‌لاین امضای Adhoc داخلی داره که نصب بدون Apple ID رو ممکن می‌کنه، و داشبوردی که ناشر توش می‌بینه بیلدش از آپلود تا انتشار کجاست.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
        context: "محصول",
      },
      {
        title: "بروکلی",
        description:
          "کالری‌شمار که مستقیم از مرورگر نصب می‌شه. از بشقاب عکس می‌گیری یا می‌گی چی خوردی و وعده ثبت می‌شه، آفلاین هم کار می‌کنه. اپ رو کامل دیباگ کردم و از React 18 و Material UI 4 بردمش روی React 19 و MUI 9.",
        stack: ["React 19", "MUI 9", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
        context: "محصول",
        logo: "/images/brookli-96.png",
      },
      {
        title: "Face Age",
        description:
          "سن ظاهری و وضعیت پوست رو از یه فریم وبکم تخمین می‌زنه. پردازش لندمارک‌های MediaPipe داخل خود مرورگر انجام می‌شه، برای همین تصویر چهره‌ی کسی از دستگاهش بیرون نمی‌ره.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
        context: "محصول",
        logo: "/images/faceage-96.png",
      },
      {
        title: "Weather",
        description:
          "اپ ری‌اکت‌نیتیو با معماری تمیز. هر فیچر به لایه‌های data و domain و presentation تقسیم شده و پشت یه کانتینر DI نشسته. پیش‌بینی هوا، کیفیت هوا و هشدارها با کش MMKV و SQLite آفلاین هم در دسترسن.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
        context: "متن‌باز",
      },
      {
        title: "Door Lock Shop",
        description:
          "فروشگاه راست‌به‌چپ قفل و یراق‌آلات، روی Next.js 16 و Payload CMS 3. یه لایه‌ی سرویس تایپ‌دار وسطشونه تا UI مستقیم از CMS کوئری نگیره. کل استک با یه دستور Docker بالا میاد.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://doorlock-shop.vercel.app/",
        context: "متن‌باز",
      },
      {
        title: "fabioCoffee",
        description:
          "سیستم کافه‌ی full-stack. منوی سفارش و پنل ادمین با Next.js، روی یه API با Express و Prisma و PostgreSQL و احراز هویت JWT.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
        context: "متن‌باز",
      },
    ],
  },
  caseStudies: {
    heading: "کیس‌استادی",
    subheading: "از مسئله تا چیزی که آخرش شیپ شد.",
    problemLabel: "مسئله",
    approachLabel: "رویکرد",
    resultLabel: "نتیجه",
    migrationLabel: "نسخه‌ها، قبل و بعد",
    shippedLabel: "بعد از ریفکتور چی اضافه شد",
    viewLive: "دیدن نسخه‌ی زنده",
    items: [
      {
        title: "سیب ایرانی",
        tagline: "بازنویسی فرانت‌اند یه اپ‌استور ایرانی، از صفر.",
        role: "Frontend Developer · بازنویسی نسخه‌ی Next.js",
        problem:
          "فرانت‌اند قبلی جواب نیازهای جدید رو نمی‌داد. هم PWA کامل می‌خواستیم، هم پنل توسعه‌دهنده‌ای که داشت بزرگ می‌شد؛ و اضافه‌کردن اینها روی کد قدیمی بیشتر از بازنویسی وقت می‌برد.",
        approach:
          "فرانت‌اند رو از صفر با Next.js نوشتم، PWA کامل با نصب‌پذیری و کش آفلاین پیاده کردم، چند فیچر هوش مصنوعی اضافه کردم و برای پنل توسعه‌دهنده با تیم‌های بک‌اند و دیزاین و محصول جلو رفتم. در طول کار هم مرتب پرفورمنس و ساختار کد رو تمیز می‌کردم.",
        result:
          "کدبیسی که هم سریع‌تره هم راحت‌تر نگه داشته می‌شه، و الان یکی از اپ‌استورهای جایگزین ایران رو می‌چرخونه؛ با ده‌ها اپ محبوب مثل اسنپ و دیجی‌کالا و دیوار، و یه پنل توسعه‌دهنده‌ی فعال.",
        stack: ["Next.js", "TypeScript", "PWA"],
        href: "https://sibirani.com",
      },
      {
        title: "بروکلی",
        tagline:
          "دیباگ کامل یه کالری‌شمارِ زنده، و بعد بردنش از React 18 و MUI 4 به React 19 و MUI 9.",
        role: "Frontend Developer · مسئول ریفکتور",
        problem:
          "بروکلی کار می‌کرد ولی روی Material UI 4 گیر کرده بود؛ نسخه‌ای که هنوز با JSS و makeStyles کار می‌کنه و چند نسخه از اکوسیستم عقب افتاده. همین یه مورد کل وابستگی‌ها رو قفل کرده بود: React از ۱۸ جلوتر نمی‌رفت، کتابخونه‌های جدید کنارش تمیز نصب نمی‌شدن و هر فیچر جدید وقت اضافه می‌برد. یه صف باگ هم مونده بود که تا وضعیت کد این شکلی بود، کسی سراغشون نمی‌رفت.",
        approach:
          "اول باگ‌ها رو تموم کردم، بعد رفتم سراغ نسخه‌ها؛ اینطوری هیچ باگ قدیمی‌ای بعداً به حساب مهاجرت گذاشته نمی‌شد. مهاجرت رو هم تیکه‌تیکه جلو بردم: اول اسم پکیج‌ها از ‎@material-ui‎ به ‎@mui‎، بعد بازنویسی همه‌ی makeStyles و withStyles با styled و sx در Emotion، بعد بردن تم نسخه‌به‌نسخه تا ۹، و آخر سر React تا ۱۹ با کنارگذاشتن findDOMNode و defaultProps و گرفتن ref به‌عنوان یه prop معمولی. فیچرهای جدید رو گذاشتم برای آخر، وقتی پایه دیگه تکون نمی‌خورد.",
        result:
          "اپ الان روی React و MUI به‌روزه، صف باگ خالی شده، ثبت وعده با عکس و صدا هم اضافه شده، و PWA در تمام این مدت نصب‌پذیر و آفلاین موند.",
        migration: [
          { label: "React", from: "18", to: "19" },
          { label: "Material UI", from: "4", to: "9" },
          { label: "اسم پکیج", from: "@material-ui/core", to: "@mui/material" },
          { label: "استایل", from: "JSS · makeStyles", to: "Emotion · styled + sx" },
        ],
        shipped: [
          "ثبت وعده از روی عکس: دوربین رو می‌گیری سمت بشقاب و فرم پر می‌شه",
          "ثبت وعده با صدا: می‌گی چی خوردی و همون رکورد ثبت می‌شه",
          "خالی‌کردن صف باگ‌ها قبل از مهاجرت، تا معلوم باشه از کجا شروع کردیم",
          "PWA در کل مسیر نصب‌پذیر و آفلاین موند؛ سرویس‌ورکر و کش دست‌نخورده",
        ],
        stack: ["React 19", "MUI 9", "PWA", "AI"],
        href: "https://app.brookliapp.com/",
      },
      {
        title: "سیب بازار",
        tagline: "اپ‌استوری برای آیفون که بدون Apple ID نصب می‌کنه.",
        role: "Frontend Developer",
        problem:
          "کاربر آیفون در ایران به App Store دسترسی نداره، و ناشرها هم راه مطمئنی نداشتن که یه بیلد امضاشده رو به دست کاربر برسونن.",
        approach:
          "فروشگاه و داشبورد ناشر رو روی یه پایپ‌لاین امضای Adhoc داخلی ساختم، طوری که مسیر هر بیلد از آپلود تا امضا و انتشار توی داشبورد پیدا باشه. زیرساخت PWA و کامپوننت‌هایی که روی سیب ایرانی جواب داده بود رو دوباره استفاده کردم.",
        result:
          "یه کانال توزیع iOS که کاربر مستقیم از مرورگر نصب می‌کنه و ناشر کل مسیر انتشار رو از توی داشبورد دنبال می‌کنه.",
        stack: ["React", "TypeScript", "PWA"],
        href: "https://sibbazar.com/",
      },
      {
        title: "Face Age",
        tagline: "تحلیل چهره بدون آپلود عکس.",
        role: "Frontend Developer · سیب ایرانی",
        problem:
          "برای تخمین سن ظاهری و وضعیت پوست باید چهره‌ی کاربر پردازش بشه؛ حساس‌ترین داده‌ای که ازش می‌خوای، و سنگین‌ترین چیزی که روی اینترنت ضعیف باید رفت‌وبرگشت کنه.",
        approach:
          "پردازش لندمارک‌های MediaPipe رو مستقیم روی استریم وبکم و داخل مرورگر اجرا کردم تا فریم‌ها از دستگاه بیرون نرن. بارگذاری مدل رو هم طوری تنظیم کردم که اولین نتیجه بدون انتظار محسوس بیاد.",
        result:
          "یه محصول تحلیل چهره که داخل مرورگر کار می‌کنه و توی اکوسیستم سیب ایرانی شیپ شد، بدون اینکه عکسی از دستگاه کاربر خارج بشه.",
        stack: ["React", "MediaPipe", "AI"],
        // TODO: replace with the public Face Age URL once there is one.
        href: "#",
      },
      {
        title: "Weather",
        tagline: "اپ ری‌اکت‌نیتیوی که با اینترنت بد هم کار می‌کنه.",
        role: "انفرادی · معماری و پیاده‌سازی",
        problem:
          "اپ هواشناسی معمولاً دقیقاً وقتی لازمت می‌شه که شبکه خرابه. از طرف دیگه، کدبیس ری‌اکت‌نیتیو اگه فیچر به فیچر رشد کنه بعد از مدتی همه‌چیز توش قاطی می‌شه.",
        approach:
          "هر فیچر رو به لایه‌های data و domain و presentation شکستم که از یه کانتینر DI حل می‌شن، روی یه core مشترک برای شبکه و کش و استوریج و لاگ و i18n. کش TanStack Query رو هم توی MMKV و SQLite ذخیره کردم تا آفلاین هم داده داشته باشیم.",
        result:
          "هفت اسلایس فیچر (هوا، کیفیت هوا، هشدارها، مکان‌ها، نقشه، پیشنهادها، تنظیمات) روی یه core مشترک، دوزبانه‌ی فارسی و انگلیسی، با پیش‌بینی‌هایی که بدون اینترنت هم باز می‌شن.",
        stack: ["React Native", "Expo", "TanStack Query"],
        href: "https://github.com/2az2000/Weather-app-native",
      },
      {
        title: "Door Lock Shop",
        tagline: "کاتالوگی که آدم غیرفنی هم بتونه بچرخونتش.",
        role: "انفرادی · معماری و پیاده‌سازی",
        problem:
          "محتوای فروشگاه رو باید کسی ویرایش کنه که کد نمی‌نویسه. ولی اگه CMS رو مستقیم به کامپوننت‌ها وصل کنی، هر تغییر اسکیما تا خود UI میاد بالا. فروشگاه فارسی هم باید واقعاً راست‌به‌چپ باشه، نه فقط ترجمه‌شده.",
        approach:
          "Next.js 16 رو روی Payload CMS 3 و Postgres سوار کردم و یه لایه‌ی سرویس تایپ‌دار گذاشتم که تنها راه دسترسی به داده باشه. کل استک با دیتابیس هم پشت یه Docker Compose و یه اسکریپت seed جمع شد.",
        result:
          "فروشگاهی که تیم از پنل ادمین دسته‌بندی و برند و محصول رو مدیریت می‌کنه، sitemap و robots و متادیتاش تولید می‌شه، و یه کلون تازه با یه دستور بالا میاد.",
        stack: ["Next.js", "Payload CMS", "PostgreSQL"],
        href: "https://doorlock-shop.vercel.app/",
      },
      {
        title: "fabioCoffee",
        tagline: "یه سیستم کافه برای مشتری و پیشخوان، با هم.",
        role: "انفرادی · full-stack",
        problem:
          "منوی کافه و پنلی که کارکنان باهاش کار می‌کنن معمولاً جدا از هم ساخته می‌شن. نتیجه‌ش اینه که محصولی روی سایت می‌مونه که از منو حذف شده.",
        approach:
          "هر دو رو روی یه اسکیما ساختم: فرانت‌اند Next.js که منوی سفارش و پنل ادمین رو با هم داره، روی API‌ای با Express و Prisma و PostgreSQL، با JWT برای جداکردن دسترسی مشتری و کارکنان.",
        result:
          "ویرایشی که پشت پیشخوان انجام می‌شه، همون رکوردیه که منو می‌خونه. نسخه‌ی دومی وجود نداره که لازم باشه هم‌گام نگهش داری.",
        stack: ["Next.js", "Express", "Prisma"],
        href: "https://fabio-coffee-frontend.vercel.app",
      },
    ],
  },
  experience: {
    heading: "سوابق کاری",
    subheading: "کارنامه، به شکل لاگ کامیت.",
    items: [
      {
        hash: "3e91c07",
        message: "ریفکتور بروکلی به React 19 و MUI 9، و شیپ ثبت وعده با هوش مصنوعی",
        date: "۱۴۰۵",
        company: "سیب ایرانی",
        role: "Senior Frontend Developer",
      },
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
        date: "۱۴۰۴",
        company: "سیب ایرانی",
        role: "Frontend Developer",
      },
      {
        hash: "74c8fa1",
        message: "توسعه اپلیکیشن PWA بروکلی برای مدیریت کالری",
        date: "۱۴۰۴",
        company: "سیب ایرانی",
        role: "Frontend Developer",
      },
      {
        hash: "5be20f7",
        message: "مدیریت فرآیند انتشار نسخه‌ها و CI/CD",
        date: "۱۴۰۴",
        company: "سیب ایرانی",
        role: "Frontend Developer",
      },
      {
        hash: "ab4329d",
        message: "طراحی معماری کامپوننت‌های قابل استفاده مجدد در React",
        date: "۱۴۰۴",
        company: "سیب ایرانی",
        role: "Frontend Developer",
      },
      {
        hash: "4fd80a2",
        message: "بهینه‌سازی رندر، ارتباط با API و افزایش Performance",
        date: "۱۴۰۴",
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
    heading: "در تماس باشیم",
    subheading: "برای همکاری یا فرصت جدید، در دسترسم.",
    fieldName: "--name",
    fieldEmail: "--email",
    fieldMessage: "--message",
    submit: "run send.sh",
    sending: "در حال ارسال...",
    success: "پیام رسید. به‌زودی جواب می‌دم.",
    errorGeneric: "یه مشکلی پیش اومد. لطفاً مستقیم ایمیل بزنید.",
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
      dialogDescription: "امیرعلی زند · Frontend Developer · بروزرسانی ۱۴۰۵",
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
      selfHosted: "روی همین دامنه، بدون CDN فونت",
    },
    rights: "طراحی و ساخت: امیرعلی زند.",
    source: "سورس روی گیت‌هاب",
  },
  palette: {
    title: "پالت دستورها",
    description: "دنبال بخش، پروژه یا کیس‌استادی بگردید، یا یک کار را اجرا کنید.",
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
      xrayHint: "دور هر بخش، فایلی که می‌سازدش",
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
    hint: "ببین چطور ساخته شده",
    title: "حالت اشعه‌ایکس",
    description: "دور هر بخش، اسم فایلی که می‌سازدش و تکنیکی که پشتش است.",
    exit: "برای خروج X یا Esc",
    close: "بستن",
    regionsLabel: "بخش‌های صفحه",
    behavioralLabel: "بدون کادر، چون اینها رفتارند نه چیدمان",
    regions: {
      navbar:
        "نشانگر لغزان با layoutId فریمر موشن، به‌علاوه‌ی اسکرول‌اسپای با IntersectionObserver.",
      hero: "ورود پلکانی با GSAP. هر سه عدد از داده‌های پایین همین صفحه حساب می‌شود، نه دستی.",
      marquee:
        "یک motion value که هر فریم آپدیت می‌شود؛ برای همین با هاور نرم می‌ایستد و می‌شود با درگ جلو و عقبش برد.",
      about:
        "رمزگشایی کلمه‌به‌کلمه روی هاور. بقیه‌ی پاراگراف کم‌رنگ می‌شود تا کلمه‌ی زیر نشانگر جلو بیفتد.",
      skills:
        "صورت‌فلکی SVG. هاور روی هر گره یال‌هایش را روشن و بقیه را محو می‌کند، و هر گره کشش مغناطیسی خودش را دارد.",
      projects:
        "ScrollTrigger.batch؛ هر کارت موقع عبور از خط وارد می‌شود، روی بنتوی نامتقارنی که کارت شاخص ۲×۲ می‌گیرد.",
      caseStudies:
        "تب‌های رادیکس با پنل‌های force-mount، تا متن همه‌ی مطالعه‌ها برای خزنده‌ها داخل HTML بماند.",
      experience:
        "لغزش یک‌درمیان که به اسکرول گره خورده، با پرتویی که هر گره کامیت را موقع عبور روشن می‌کند.",
      contact:
        "یک فرم واقعی با ظاهر ترمینال. فلگ‌ها همان برچسب فیلدها هستند و زمان‌هایی که چاپ می‌کند، دور درخواست واقعی اندازه‌گیری شده.",
      footer:
        "اطلاعات build موقع کامپایل داخل کد نوشته می‌شود، پس نسخه و تاریخ مال همین باندلی است که اجرا شده.",
    },
    behavioral: {
      cursor:
        "دو فنر: یک نقطه که دقیق دنبال می‌کند و یک حلقه که روی چیزهای کلیک‌شدنی می‌نشیند و شکلشان را می‌گیرد.",
      curtain:
        "زبان زیر پوشش عوض می‌شود؛ دیکشنری و جهت متن فقط وقتی می‌چرخند که صفحه کاملاً پوشیده است.",
      smoothScroll:
        "لنیس روی تیکر GSAP. کل سایت یک فریم مشترک دارد و هیچ افکت اسکرولی عقب نمی‌افتد.",
      reveal: "یک هوک ورود مشترک برای همه‌ی بخش‌ها، تا ورودشان با هم هماهنگ بماند.",
    },
  },
};
