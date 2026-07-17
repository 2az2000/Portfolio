"use client";

import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGsapReveal } from "@/lib/useGsapReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  const { t } = useLanguage();
  const containerRef = useGsapReveal<HTMLDivElement>({
    selector: "[data-reveal]",
    stagger: 0.12,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // No backend yet — hand off to the visitor's own mail client with the
    // message pre-filled, so the form is genuinely functional today rather
    // than a fake "sent!" state. Swap this for a real POST once an API
    // route exists.
    const subject = encodeURIComponent(`Portfolio contact from ${name || "—"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${t.contact.email}?subject=${subject}&body=${body}`;
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
            <TerminalField
              flag={t.contact.fieldName}
              value={name}
              onChange={setName}
              required
            />
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
              <MagneticButton type="submit">
                <span className="text-mint">$</span> {t.contact.submit}
              </MagneticButton>
            </div>
          </form>
        </div>

        <div data-reveal className="flex flex-col gap-3">
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
