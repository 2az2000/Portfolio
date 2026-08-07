"use client";

import { useCallback, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, ExternalLink, FileText, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** A4 at 96dpi — the exact CSS pixel box the embedded document lays out in. */
const DOC_WIDTH = 794;
const DOC_HEIGHT = 1123;

export type DocumentPreviewLabels = {
  /** Small mono eyebrow above the card title. */
  eyebrow: string;
  /** Card title, e.g. "Resume". */
  title: string;
  /** Short spec line on the card, e.g. "PDF · A4". */
  meta: string;
  /** Overlay call-to-action shown on hover/focus of the card. */
  action: string;
  /** Dialog heading. */
  dialogTitle: string;
  /** Dialog sub-line, also the dialog's accessible description. */
  dialogDescription: string;
  /** Label for the "open the document in its own tab" link. */
  openInNewTab: string;
  /** Label for the download link. */
  download: string;
  /** Accessible name for the dialog's close button. */
  close: string;
};

type DocumentPreviewProps = {
  /** URL of the embeddable HTML document (rendered in an iframe). */
  documentSrc: string;
  /** URL of the downloadable PDF rendition of the same document. */
  pdfSrc: string;
  /** Filename suggested to the browser on download. */
  pdfFileName: string;
  labels: DocumentPreviewLabels;
  /** Visible height of the card's cropped thumbnail, in px. */
  thumbnailHeight?: number;
  className?: string;
};

/**
 * Measures the returned ref's box and reports the factor that fits an A4
 * document into it (never scaling up past 1:1). The document is embedded at
 * its natural A4 pixel size and scaled with a transform rather than given a
 * percentage width, because it's a fixed-geometry print layout — reflowing it
 * to the container would break the very thing being previewed.
 *
 * `"width"` fits the width only, so the frame shows a top crop of the page;
 * `"contain"` fits both axes, so the whole page is visible at once.
 */
function useFitScale<T extends HTMLElement>(mode: "width" | "contain" = "width") {
  const [scale, setScale] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  // A callback ref, not useLayoutEffect + useRef: the dialog's stage only
  // enters the DOM when Radix mounts the dialog content, which is long after
  // this component's own effects have run. An effect would measure `null`
  // once on page load and never again, leaving the preview at scale 0.
  const ref = useCallback(
    (el: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!el) {
        setScale(0);
        return;
      }

      const measure = () =>
        setScale(
          Math.min(
            1,
            el.clientWidth / DOC_WIDTH,
            mode === "contain" ? el.clientHeight / DOC_HEIGHT : Infinity
          )
        );

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      observerRef.current = observer;
    },
    [mode]
  );

  return { ref, scale };
}

/**
 * A card showing a live, cropped preview of an HTML document, which opens
 * full-size in a dialog with links to view it standalone or download its PDF.
 *
 * Deliberately content-agnostic (AGENTS.md §5, modularity rule 1): every
 * string arrives through `labels` and every URL through props, so this works
 * for any A4-shaped document, not just a résumé.
 */
export function DocumentPreview({
  documentSrc,
  pdfSrc,
  pdfFileName,
  labels,
  thumbnailHeight = 208,
  className,
}: DocumentPreviewProps) {
  const thumb = useFitScale<HTMLDivElement>("width");
  const stage = useFitScale<HTMLDivElement>("contain");

  return (
    <Dialog.Root>
      {/* The trigger is a bare button stretched over the card rather than a
          button *wrapping* it: an <iframe> is interactive content and isn't
          allowed inside <button>, and nesting it there also lets the frame
          swallow the click on some browsers. */}
      <div
        className={cn(
          "glass group relative overflow-hidden rounded-lg transition-colors duration-fast ease-brand focus-within:border-violet/40 hover:border-violet/40",
          className
        )}
      >
        {/* Cropped live render of the real document — never a screenshot, so
            it can't drift out of sync with the file people download. */}
        <div
          ref={thumb.ref}
          aria-hidden
          className="relative overflow-hidden bg-white"
          style={{ height: thumbnailHeight }}
        >
          <iframe
            src={documentSrc}
            title=""
            tabIndex={-1}
            loading="lazy"
            className="pointer-events-none absolute left-0 top-0 border-0"
            style={{
              width: DOC_WIDTH,
              height: DOC_HEIGHT,
              transform: `scale(${thumb.scale})`,
              transformOrigin: "top left",
              visibility: thumb.scale ? "visible" : "hidden",
            }}
          />

          {/* Fades the crop into the card instead of ending on a hard cut. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent" />

          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-void/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-fast ease-brand group-focus-within:opacity-100 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-pill bg-violet px-4 py-2 text-sm font-medium text-ink">
              <Maximize2 size={14} />
              {labels.action}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet/15 text-violet">
            <FileText size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="caption block text-violet-soft">{labels.eyebrow}</span>
            <span className="block truncate text-sm text-ink">{labels.title}</span>
          </span>
          <span className="caption shrink-0 text-mist">{labels.meta}</span>
        </div>

        <Dialog.Trigger className="focus-ring absolute inset-0 z-10 rounded-lg">
          <span className="sr-only">{labels.action}</span>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          // Keeps the page's smooth scroller from treating a wheel gesture
          // over the open dialog as a request to scroll the page behind it
          // (see components/SmoothScroll.tsx).
          data-lenis-prevent
          className={cn(
            // A fixed height (not max-height) on purpose: the preview scales
            // itself to the room left over, so that room has to be a known
            // quantity rather than something the content decides.
            "fixed left-1/2 top-1/2 z-50 flex h-[92vh] w-[min(96vw,46rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-glass",
            "data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-display text-lg text-ink">
                {labels.dialogTitle}
              </Dialog.Title>
              <Dialog.Description className="caption mt-1 truncate text-mist">
                {labels.dialogDescription}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={labels.close}
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-mist transition-colors duration-fast ease-brand hover:border-violet/40 hover:text-ink"
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          {/* The whole page is fitted into whatever room the dialog has left
              after its header and footer, so the preview reads as one
              document rather than a window onto a scrolling one. */}
          <div
            ref={stage.ref}
            className="flex min-h-0 flex-1 items-center justify-center bg-void/40 p-3 sm:p-5"
          >
            <div
              className="relative shrink-0 overflow-hidden rounded-md bg-white shadow-glass"
              style={{ width: DOC_WIDTH * stage.scale, height: DOC_HEIGHT * stage.scale }}
            >
              <iframe
                src={documentSrc}
                title={labels.dialogTitle}
                className="absolute left-0 top-0 border-0"
                style={{
                  width: DOC_WIDTH,
                  height: DOC_HEIGHT,
                  transform: `scale(${stage.scale})`,
                  transformOrigin: "top left",
                  visibility: stage.scale ? "visible" : "hidden",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            <a
              href={documentSrc}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-pill border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-fast ease-brand hover:border-violet/50"
            >
              <ExternalLink size={15} />
              {labels.openInNewTab}
            </a>
            <a
              href={pdfSrc}
              download={pdfFileName}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-pill bg-violet px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-fast ease-brand hover:bg-violet-soft"
            >
              <Download size={15} />
              {labels.download}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
