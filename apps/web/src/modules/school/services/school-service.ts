// src/modules/core/services/school.service.ts
import { SchoolRepository } from "@/src/modules/school/repositories/school-repository";
import { BranchRepository } from "@/src/modules/branch/repositories/branch-repository";
import { BaseService } from "@/src/modules/core/services/base-service";
import { School } from "@prisma/client";
import { nowTimestamp } from "@/src/lib/utils/time";
import { Permission } from "../../core/decorators/permission.decorator";
import { Log } from "../../core/decorators/log-decorator";
import type { SchoolInput } from "@/src/app/lib/validations/school-schema";

export class SchoolService extends BaseService<School, SchoolRepository> {
  constructor(private branchRepo = new BranchRepository()) {
    super(new SchoolRepository());
  }

  /**
   * Get the school with branches
   */
  @Permission("school", "read")
  async getSchool() {
    const school = await this.repository.getSchool();
    
    if (!school) {
      return {
        id: null,
        legalName: "",
        displayName: "",
        type: "secondary",
        status: "active",
        registrationNumber: "",
        establishedDate: null,
        email: "",
        phoneMain: "",
        website: "",
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        logoUrl: "",
        motto: "",
        themeColor: "#0D47A1",
        defaultTimeZone: "Africa/Nairobi",
        defaultLanguage: "en",
        currency: "KES",
        primaryContact: null,
        branches: [],
      };
    }

    return this.transformSchool(school);
  }

  /**
   * Create or update the school
   */
  @Permission("school", "update")
  @Log("UPDATE", "School", "School details updated")
  async upsertSchool(data: SchoolInput) {
    const current = await this.repository.getSchool();
    
    const schoolData = {
      legal_name: data.legalName,
      display_name: data.displayName,
      type: data.type,
      status: data.status,
      registration_number: data.registrationNumber,
      established_date: data.establishedDate ? new Date(data.establishedDate) : null,
      email: data.email,
      phone_main: data.phoneMain,
      website: data.website,
      address_line1: data.addressLine1,
      city: data.city,
      logo_url: data.logoUrl,
      motto: data.motto,
      primary_contact_id: data.primaryContactId,
      updated_at: nowTimestamp(),
    };

    if (current) {
      return await super.update(current.id, schoolData);
    } else {
      return await super.create({
        ...schoolData,
        created_at: nowTimestamp(),
      });
    }
  }
  /**
   * Get all schools, optionally including their branches
   */
  async getAll() {
    return this.repository.list({
      orderBy: { created_at: "desc" },
    });
  }

  private transformSchool(school: any) {
    return {
      id: school.id,
      legalName: school.legal_name,
      displayName: school.display_name,
      type: school.type,
      status: school.status,
      registrationNumber: school.registration_number,
      establishedDate: school.established_date,
      email: school.email,
      phoneMain: school.phone_main,
      website: school.website,
      addressLine1: school.address_line1,
      city: school.city,
      logoUrl: school.logo_url,
      motto: school.motto,
      primaryContact: school.primary_contact ? {
        id: school.primary_contact.id,
        fullName: `${school.primary_contact.first_name} ${school.primary_contact.last_name}`,
        email: school.primary_contact.email,
        profilePhoto: school.primary_contact.profile_photo,
      } : null,
      branches: school.branches.map((branch: any) => ({
        id: branch.id,
        branchName: branch.branch_name,
        branchCode: branch.branch_code,
        branchAddress: branch.branch_address,
        branchEmail: branch.branch_email,
        branchPhoneNumber: branch.branch_phone_number,
        openingTime: branch.opening_time,
        closingTime: branch.closing_time,
        isActive: branch.is_active,
        branchManager: branch.branch_manager ? {
          id: branch.branch_manager.id,
          fullName: `${branch.branch_manager.first_name} ${branch.branch_manager.last_name}`,
          email: branch.branch_manager.email,
          profilePhoto: branch.branch_manager.profile_photo,
        } : null,
      })),
    };
  };
}
