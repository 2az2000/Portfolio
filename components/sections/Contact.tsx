"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { DURATION, EASE_BRAND } from "@/lib/theme";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "sending" | "success" | "error";

type LogLine = {
  text: string;
  tone: "muted" | "success" | "error";
};

/** Fills the `{ms}` slot in a log template. A placeholder rather than
 *  concatenation, because the number sits mid-sentence in Persian and at the
 *  end in English. */
function withElapsed(template: string, ms: number): string {
  return template.replace("{ms}", String(ms));
}

export function Contact() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({
    selector: "[data-reveal]",
    stagger: 0.12,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [log, setLog] = useState<LogLine[]>([]);

  /**
   * The form answers in its own idiom: a terminal prints what it is doing.
   *
   * Every line is tied to something that actually happened, and the duration
   * is measured around the real request rather than faked with a timer. A
   * section whose entire premise is that it looks like a shell would be worth
   * nothing if the shell were lying — the timing is the one number here a
   * visitor can check against their own network tab.
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setLog([
      { text: t.contact.log.validating, tone: "muted" },
      { text: t.contact.log.request, tone: "muted" },
    ]);

    const startedAt = performance.now();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const elapsed = Math.round(performance.now() - startedAt);
      if (!res.ok) throw new Error("request failed");

      setStatus("success");
      setLog((prev) => [
        ...prev,
        { text: withElapsed(t.contact.log.delivered, elapsed), tone: "success" },
        { text: `# ${t.contact.success}`, tone: "muted" },
      ]);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const elapsed = Math.round(performance.now() - startedAt);
      // The specific server-side reason (missing API key, Resend outage,
      // etc.) is logged there, not surfaced here — showing a raw English
      // error string on top of a Persian UI would read as broken in its
      // own right, so visitors always get the translated generic message.
      console.error("Contact form submission failed:", err);
      setStatus("error");
      setLog((prev) => [
        ...prev,
        { text: withElapsed(t.contact.log.failed, elapsed), tone: "error" },
        { text: `# ${t.contact.errorGeneric}`, tone: "muted" },
      ]);
    }
  }

  return (
    <section id="contact" className="section-py container" ref={containerRef}>
      <div data-reveal className="mb-12 max-w-2xl">
        <p className="caption mb-3">{t.nav.contact}</p>
        <h2 className="text-h2 font-display text-ink">{t.contact.heading}</h2>
        <p className="mt-3 text-body text-mist">{t.contact.subheading}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div data-reveal className="glass overflow-hidden rounded-lg">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-mist">
            <Terminal size={14} />
            <span className="caption">amirali@portfolio:~</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 font-mono text-sm">
            <TerminalField flag={t.contact.fieldName} value={name} onChange={setName} required />
            <TerminalField
              flag={t.contact.fieldEmail}
              value={email}
              onChange={setEmail}
              type="email"
              required
            />
            <TerminalTextarea
              flag={t.contact.fieldMessage}
              value={message}
              onChange={setMessage}
              required
            />

            <div className="pt-2">
              <MagneticButton type="submit" disabled={status === "sending"}>
                <span className="text-mint">$</span> {t.contact.submit}
              </MagneticButton>

              {/* The visible log is decoration to a screen reader — it would
                  read four fragments in sequence, three of which are progress
                  noise. The single sentence below carries the outcome instead,
                  which is the only part that is actually news. */}
              <div aria-hidden className="mt-4 space-y-1 font-mono text-xs">
                <AnimatePresence initial={false}>
                  {log.map((line, i) => (
                    <motion.p
                      key={`${line.text}-${i}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: DURATION.fast,
                        ease: EASE_BRAND,
                        delay: i * 0.05,
                      }}
                      className={cn(
                        "rtl:[direction:ltr] rtl:text-end",
                        line.tone === "success" && "text-mint",
                        line.tone === "error" && "text-destructive",
                        line.tone === "muted" && "text-mist"
                      )}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </AnimatePresence>
                {status === "sending" && (
                  <span className="inline-block h-3 w-1.5 animate-pulse bg-mint align-middle" />
                )}
              </div>

              <p role="status" className="sr-only">
                {status === "sending" && t.contact.sending}
                {status === "success" && t.contact.success}
                {status === "error" && t.contact.errorGeneric}
              </p>
            </div>
          </form>
        </div>

        <div data-reveal className="flex flex-col gap-3">
          <DocumentPreview
            documentSrc={t.contact.resume.documentUrl}
            pdfSrc={t.contact.resume.pdfUrl}
            pdfFileName={t.contact.resume.pdfFileName}
            labels={t.contact.resume}
          />
          <SocialLink href={`mailto:${t.contact.email}`} icon={Mail} label={t.contact.email} />
          <SocialLink href={t.contact.github} icon={Github} label="GitHub" />
          <SocialLink href={t.contact.linkedin} icon={Linkedin} label="LinkedIn" />
        </div>
      </div>
    </section>
  );
}

function TerminalField({
  flag,
  value,
  onChange,
  type = "text",
  required,
}: {
  flag: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 border-b border-line pb-2">
      <span className="shrink-0 text-mint">{flag}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-ink outline-none placeholder:text-mist"
        placeholder="..."
      />
    </label>
  );
}

function TerminalTextarea({
  flag,
  value,
  onChange,
  required,
}: {
  flag: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 border-b border-line pb-2">
      <span className="shrink-0 text-mint">{flag}</span>
      <textarea
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none bg-transparent text-ink outline-none placeholder:text-mist"
        placeholder="..."
      />
    </label>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Mail;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="glass focus-ring flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-ink transition-colors duration-fast ease-brand hover:border-white/20"
    >
      <Icon size={16} className="text-mint" />
      <span className="truncate">{label}</span>
    </a>
  );
}
