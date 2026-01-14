/**
 * Represents the quality/reliability of a sensor reading
 */
export const ReadingQuality = {
  Good: "good",
  Uncertain: "uncertain",
  Bad: "bad",
  Simulated: "simulated",
} as const;

export type ReadingQuality =
  (typeof ReadingQuality)[keyof typeof ReadingQuality];
