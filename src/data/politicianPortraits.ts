import type { HistoricalElectionYear, Party } from "@/types/election";

export type PoliticianPortraitRecord = {
  name: string;
  party: Party;
  role: string;
  imageUrl: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type PortraitSource = Pick<
  PoliticianPortraitRecord,
  "imageUrl" | "sourceLabel" | "sourceUrl"
>;

/**
 * Congress publishes roster headshots at a stable URL keyed by Bioguide ID.
 * Keeping this as a URL builder avoids copying hundreds of photos into the app.
 */
export function getBioguidePortrait(bioguideId: string): PortraitSource {
  const imageUrl = `https://bioguide.congress.gov/photo/${encodeURIComponent(
    bioguideId,
  )}.jpg`;

  return {
    imageUrl,
    sourceLabel: "U.S. Congress Bioguide",
    sourceUrl: imageUrl,
  };
}

/**
 * The app currently has candidate labels only for the latest presidential
 * baseline. Older baseline years intentionally omit portraits until their
 * candidate records and official-source images are added together.
 */
export const presidentialCandidatePortraitsByYear: Partial<
  Record<HistoricalElectionYear, readonly PoliticianPortraitRecord[]>
> = {
  2024: [
    {
      name: "Kamala Harris",
      party: "democratic",
      role: "2024 Democratic nominee",
      imageUrl: "https://bioguide.congress.gov/photo/H001075.jpg",
      sourceLabel: "U.S. Congress Bioguide",
      sourceUrl: "https://bioguide.congress.gov/photo/H001075.jpg",
    },
    {
      name: "Donald Trump",
      party: "republican",
      role: "2024 Republican nominee",
      imageUrl:
        "https://tile.loc.gov/storage-services/service/pnp/ppbd/11600/11614r.jpg",
      sourceLabel: "Library of Congress",
      sourceUrl: "https://www.loc.gov/item/2025163294/",
    },
  ],
};
