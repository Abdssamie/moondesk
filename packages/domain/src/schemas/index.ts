import { z } from "zod";
import { Parameter } from "../enums/parameter";
import { Protocol } from "../enums/protocol";
import { SensorType } from "../enums/sensor-type";
import { ReadingQuality } from "../enums/reading-quality";

// Common schemas
export const IdParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "ID must be a number",
    })
    .transform((val) => parseInt(val, 10)),
});

export const AssetIdParamSchema = z.object({
  assetId: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Asset ID must be a number",
    })
    .transform((val) => parseInt(val, 10)),
});

// Asset schemas
export const CreateAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export const UpdateAssetSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

// Sensor schemas
export const CreateSensorSchema = z.object({
  assetId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(SensorType),
  parameter: z.nativeEnum(Parameter),
  unit: z.string().min(1, "Unit is required"),
  thresholdLow: z.number().nullable().optional(),
  thresholdHigh: z.number().nullable().optional(),
  minValue: z.number().nullable().optional(),
  maxValue: z.number().nullable().optional(),
  samplingIntervalMs: z.number().int().positive().default(1000),
  isActive: z.boolean().default(true),
  protocol: z.nativeEnum(Protocol),
  description: z.string().nullable().optional(),
  metadata: z.record(z.string()).optional(),
});

export const UpdateSensorSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.nativeEnum(SensorType).optional(),
  parameter: z.nativeEnum(Parameter).optional(),
  unit: z.string().optional(),
  thresholdLow: z.number().nullable().optional(),
  thresholdHigh: z.number().nullable().optional(),
  minValue: z.number().nullable().optional(),
  maxValue: z.number().nullable().optional(),
  samplingIntervalMs: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  protocol: z.nativeEnum(Protocol).optional(),
  description: z.string().nullable().optional(),
  metadata: z.record(z.string()).optional(),
});

// Reading schemas
export const CreateReadingSchema = z.object({
  sensorId: z.number().int().positive(),
  timestamp: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  value: z.number(),
  parameter: z.nativeEnum(Parameter),
  protocol: z.nativeEnum(Protocol),
  quality: z.nativeEnum(ReadingQuality).optional(),
  notes: z.string().nullable().optional(),
  metadata: z.record(z.string()).optional(),
});
