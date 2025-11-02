"use client";

import { CreateEnquiryInput } from "@/src/app/lib/validations/admission-validation";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class EnquiryClientService {
  baseUrl = "/api/enquiries";

  private async handleApiResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Request failed",
        };
      }

      return {
        success: true,
        ...data,
      };
    } catch {
      return {
        success: false,
        message: "Failed to parse response",
      };
    }
  }

  async createEnquiry(data: CreateEnquiryInput): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await this.handleApiResponse(response);
    } catch (error) {
      console.error("Error creating enquiry:", error);
      return {
        success: false,
        message: "Network error while creating enquiry",
      };
    }
  }
}
