// src/app/actions/school-actions.ts
"use server";

import {
  schoolSchema,
  type SchoolInput,
} from "@/src/app/lib/validations/school-schema";

/**
 * A reusable type for all server action responses.
 * Ensures consistent typing between form state and component.
 */
export type ActionResponse =
  | { success: string; error?: never }
  | { error: string; success?: never };

/**
 * SAVE SCHOOL DETAILS
 */
export async function saveSchoolDetails(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: Partial<SchoolInput> = {
      legalName: formData.get("legalName") as string,
      displayName: formData.get("displayName") as string,
      type: formData.get("type") as
        | "primary"
        | "secondary"
        | "tertiary"
        | "other",
      status: formData.get("status") as "active" | "inactive",
      registrationNumber: formData.get("registrationNumber") as string,
      establishedDate: formData.get("establishedDate") as string,
      email: formData.get("email") as string,
      phoneMain: formData.get("phoneMain") as string,
      website: formData.get("website") as string,
      addressLine1: formData.get("addressLine1") as string,
      city: formData.get("city") as string,
      logoUrl: formData.get("logoUrl") as string,
      motto: formData.get("motto") as string,
      primaryContactId: formData.get("primaryContactId")
        ? parseInt(formData.get("primaryContactId") as string, 10)
        : undefined,
    };

    // Validate input using Zod
    const validatedData = schoolSchema.parse(rawData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, {
      method: "POST",
      body: JSON.stringify(validatedData),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { error: json.message || "Failed to save school details." };
    }

    return { success: "School details saved successfully!" };
  } catch (err) {
    console.error("Server action error:", err);
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Failed to save school details." };
  }
}

/**
 * UPDATE SCHOOL DETAILS
 */
export async function updateSchoolDetails(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: Partial<SchoolInput> = {
      legalName: formData.get("legalName") as string,
      displayName: formData.get("displayName") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      registrationNumber: formData.get("registrationNumber") as string,
      establishedDate: formData.get("establishedDate") as string,
      email: formData.get("email") as string,
      phoneMain: formData.get("phoneMain") as string,
      website: formData.get("website") as string,
      addressLine1: formData.get("addressLine1") as string,
      city: formData.get("city") as string,
      logoUrl: formData.get("logoUrl") as string,
      motto: formData.get("motto") as string,
      primaryContactId: formData.get("primaryContactId")
        ? parseInt(formData.get("primaryContactId") as string, 10)
        : undefined,
    };

    const validatedData = schoolSchema.parse(rawData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return { error: json.message || "Failed to update school details." };
    }

    return { success: "School details updated successfully!" };
  } catch (err) {
    console.error("Update error:", err);
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "An unexpected error occurred while updating school." };
  }
}
