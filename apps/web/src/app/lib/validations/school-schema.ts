// src/app/lib/validations/school-schema.ts
import { z } from "zod";

export const schoolSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  displayName: z.string().min(1, "Display name is required"),
  type: z.enum(["primary", "secondary", "tertiary", "other"]),
  status: z.enum(["active", "inactive"]).default("active").optional(),
  registrationNumber: z.string().optional(),
  establishedDate: z.string().optional(),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  phoneMain: z.string().optional(),
  website: z.url("Invalid URL").optional().or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  logoUrl: z.string().optional(),
  motto: z.string().optional(),
  primaryContactId: z.number().optional(),
});

export type SchoolInput = z.infer<typeof schoolSchema>;

export const branchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  branchCode: z.string().optional(),
  branchAddress: z.string().optional(),
  branchEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  branchPhoneNumber: z.string().optional(),
  branchManagerId: z.number().optional(),
  openingTime: z.string().optional(), // "HH:MM" format
  closingTime: z.string().optional(), // "HH:MM" format
  isActive: z.boolean().default(true),
});

export type BranchInput = z.infer<typeof branchSchema>;
