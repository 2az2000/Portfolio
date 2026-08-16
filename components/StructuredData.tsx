import { dictionaries } from "@/lib/i18n";
import { META, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Person + WebSite JSON-LD, emitted once from the English layout.
 *
 * Everything here is read from the dictionaries and `lib/site.ts` rather than
 * retyped, because structured data is the one part of a page nobody ever looks
 * at again: a hand-maintained duplicate of the contact details would drift
 * from the visible ones and no one would notice for a year.
 *
 * `@graph` rather than two separate script tags so the Person and the WebSite
 * can reference each other by `@id` — that link is what tells a consumer the
 * site is *by* this person rather than merely mentioning them.
 */
export function StructuredData() {
  const t = dictionaries.en;

  const personId = `${SITE_URL}/#person`;
  const siteId = `${SITE_URL}/#website`;

  // The LinkedIn entry in the dictionary is still a placeholder. `sameAs` is a
  // claim of identity, so a URL that resolves to nothing is worse than an
  // absent one — filtered here rather than hardcoded so it starts working the
  // moment the real handle lands in lib/i18n/en.ts.
  const sameAs = [t.contact.github, t.contact.linkedin].filter(
    (url): url is string => Boolean(url) && !url.includes("/TODO")
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_NAME,
        alternateName: dictionaries.fa.hero.title,
        jobTitle: "Frontend Developer",
        description: META.en.description,
        email: `mailto:${t.contact.email}`,
        url: SITE_URL,
        image: `${SITE_URL}/icon.png`,
        sameAs,
        knowsLanguage: ["en", "fa"],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: META.en.title,
        description: META.en.description,
        inLanguage: ["en", "fa"],
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised, not templated: the values come from a typed object, and
      // `dangerouslySetInnerHTML` is the only way React will emit raw JSON
      // inside a script tag without escaping the quotes into entities.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
