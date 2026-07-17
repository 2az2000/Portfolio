"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import HyperTextParagraph from "@/components/ui/hyper-text-with-decryption";

export function About() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({ selector: "[data-reveal]" });

  // کلمات هایلایت باید دقیقاً با کلمات موجود در متن مطابقت داشته باشند
  // برای مثال اگر در متن "React" داریم، باید "react" (کوچک) باشد
  const highlightWords = [
    // English keywords
    "react",
    "frontend",
    "nextjs",
    "typescript",
    "interfaces",
    "pixel",
    "transitions",
    "microinteractions",
    "experiences",
    // Persian keywords (بدون اعراب و تشدید)
    "فرانتاند",
    "رابطهای",
    "پیکسل",
    "انیمیشن",
    "تعامل",
    "تجربههایی",
  ];

  return (
    <section id="about" className="section-py container" ref={containerRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <h2 className="text-h2 font-display text-ink">{t.about.heading}</h2>
      </div>

      <div data-reveal className="glass rounded-[20px] p-6 md:p-10">
        <HyperTextParagraph
          text={t.about.body}
          highlightWords={highlightWords}
          className="text-body text-ink leading-relaxed"
        />
      </div>
    </section>
  );
}