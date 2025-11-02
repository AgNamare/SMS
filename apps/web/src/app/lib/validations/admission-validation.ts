import { z } from "zod";

export const createEnquirySchema = z.object({
  enquiry_no: z
    .string()
    .min(1, "Enquiry number is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Enquiry number must be alphanumeric"),
  student_first_name: z.string().min(1, "Student first name is required"),
  student_middle_name: z.string().optional(),
  student_last_name: z.string().min(1, "Student last name is required"),
  guardian_first_name: z.string().min(1, "Guardian first name is required"),
  guardian_last_name: z.string().min(1, "Guardian last name is required"),
  contact_number: z
    .string()
    .min(7, "Contact number must be at least 7 digits")
    .max(15, "Contact number must be less than 15 digits")
    .regex(/^[0-9+\-()\s]+$/, "Inval  id contact number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  academic_year: z
    .number("Academic year must be a number")
    .int()
    .positive("Academic year must be positive"),
  source_of_enquiry: z.string().min(1, "Source of enquiry is required"),
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
  next_follow_up_date: z.date().optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const createApplicationSchema = z.object({
  application_no: z
    .string()
    .min(1, "Application number is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Application number must be alphanumeric"),

  enquiry_no: z
    .string()
    .min(1, "Enquiry number is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Enquiry number must be alphanumeric")
    .optional(),

  student_first_name: z.string().min(1, "Student first name is required"),
  student_middle_name: z.string().optional(),
  student_last_name: z.string().min(1, "Student last name is required"),

  guardian_first_name: z.string().min(1, "Guardian first name is required"),
  guardian_last_name: z.string().min(1, "Guardian last name is required"),

  dob: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      "Date of birth cannot be in the future"
    ),

  gender: z.number().max(1, "Gender is required"),

  religion: z.string().optional(),
  previous_school: z.string().optional(),
  previous_class: z.string().optional(),

  academic_year: z
    .number()
    .int()
    .positive("Academic year must be a positive integer"),

  class_applied: z.string().min(1, "Class applied for is required"),
  address: z.string().min(1, "Address is required"),

  document: z.string().optional(),

  application_status: z.string().min(1, "Application status is required"),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
