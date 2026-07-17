"use client";

import { useState } from "react";
import type { Party } from "@/types/election";
import styles from "@/components/PoliticianPortrait.module.css";

export type PoliticianPortraitProps = {
  name: string;
  role: string;
  imageUrl?: string | null;
  party?: Party | null;
  sourceLabel?: string;
  sourceUrl?: string;
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "?";
}

export function PoliticianPortrait({
  imageUrl,
  name,
  party,
  role,
  sourceLabel,
  sourceUrl,
}: PoliticianPortraitProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl && imageUrl !== failedImageUrl);

  return (
    <article className={styles.card} data-party={party ?? "neutral"}>
      <div className={styles.imageFrame}>
        {showImage ? (
          <img
            alt={`${name}, ${role}`}
            decoding="async"
            loading="lazy"
            onError={() => setFailedImageUrl(imageUrl ?? null)}
            src={imageUrl ?? undefined}
          />
        ) : (
          <span
            aria-label={`Portrait unavailable for ${name}`}
            className={styles.initials}
            role="img"
          >
            {getInitials(name)}
          </span>
        )}
      </div>

      <div className={styles.identity}>
        <strong>{name}</strong>
        <span>{role}</span>
        <small>
          {sourceLabel && sourceUrl ? (
            <>
              Portrait: {" "}
              <a href={sourceUrl} rel="noreferrer" target="_blank">
                {sourceLabel}
              </a>
            </>
          ) : (
            "Official portrait unavailable"
          )}
        </small>
      </div>
    </article>
  );
}

export function PoliticianPortraitGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section aria-label={label} className={styles.group}>
      {children}
    </section>
  );
}
