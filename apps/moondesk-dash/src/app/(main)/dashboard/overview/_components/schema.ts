import { z } from "zod";

export const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  location: z.string(),
  lastReading: z.string(),
  lastSeen: z.string(),
  activeAlerts: z.number(),
});

// Legacy schema for table-cell-viewer (from demo template)
export const sectionSchema = z.object({
  id: z.string(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});
