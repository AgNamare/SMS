// src/app/school/page.tsx
import { getServerSession } from "next-auth";
import { SchoolService } from "@/src/modules/school/services/school-service";
import { UserService } from "@/src/modules/user/services/user-service";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Separator } from "@/src/app/components/ui/separator";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const schoolService = new SchoolService();
  const school = await schoolService.getSchool();

  console.log("School data from DB:", {
    logoUrl: school?.logoUrl,
    displayName: school?.displayName,
    hasLogo: !!school?.logoUrl,
    logoUrlType: typeof school?.logoUrl,
  });

  return {
    title: school
      ? `${school.displayName} - EduManage`
      : "School Information - EduManage",
    description: school
      ? `View details for ${school.displayName}`
      : "School management system",
    icons: {
      icon: school?.logoUrl || "/favicon.ico",
      apple: school?.logoUrl || "/apple-touch-icon.png",
    },
    openGraph: {
      title: school ? `${school.displayName} - EduManage` : "EduManage",
      description: school
        ? `Educational institution details`
        : "School management system",
      images: school?.logoUrl ? [{ url: school.logoUrl }] : [],
    },
  };
}

export default async function SchoolPage() {
  const schoolService = new SchoolService();
  const userService = new UserService();

  try {
    const school = await schoolService.getSchool();

    if (!school) {
      return (
        <div className='container mx-auto py-8 px-4'>
          <div className='max-w-4xl mx-auto text-center space-y-6'>
            <Building2 className='h-16 w-16 text-muted-foreground mx-auto' />
            <h1 className='text-3xl font-bold text-foreground'>
              No School Data
            </h1>
            <p className='text-muted-foreground text-lg'>
              School information has not been set up yet.
            </p>
          </div>
        </div>
      );
    }

    const formatDate = (dateString?: string) => {
      if (!dateString) return "Not specified";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const getSchoolTypeLabel = (type: string) => {
      const types: { [key: string]: string } = {
        primary: "Primary School",
        secondary: "Secondary School",
        tertiary: "Tertiary Institution",
        other: "Other",
      };
      return types[type] || type;
    };

    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='max-w-6xl mx-auto space-y-6'>
          {/* Header */}
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-4'>
              {school.logoUrl ? (
                <img
                  src={school.logoUrl}
                  alt={`${school.displayName} logo`}
                  className='h-16 w-16 object-contain rounded-lg border-2 border-primary/20'
                />
              ) : (
                <Building2 className='h-16 w-16 text-primary' />
              )}
              <div className='text-left'>
                <h1 className='text-4xl font-bold text-foreground'>
                  {school.legalName}
                </h1>
                {school.motto && (
                  <p className='text-lg text-muted-foreground italic mt-2'>
                    "{school.motto}"
                  </p>
                )}
              </div>
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Badge
                variant={school.status === "active" ? "default" : "secondary"}
                className={`text-sm px-3 py-1 ${
                  school.status === "active"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}>
                {school.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant='outline'
                className='text-sm px-3 py-1 border-primary text-primary'>
                {getSchoolTypeLabel(school.type)}
              </Badge>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Main Information Column */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Institution Details */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5'>
                  <CardTitle className='text-foreground'>
                    <Building2 className='h-5 w-5' />
                    Institution Details
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Official information and registration details
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground'>
                          Legal Name
                        </h4>
                        <p className='text-lg font-semibold text-foreground'>
                          {school.legalName}
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground'>
                          Display Name
                        </h4>
                        <p className='text-lg font-semibold text-foreground'>
                          {school.displayName}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />
                          Established Date
                        </h4>
                        <p className='text-lg text-foreground'>
                          {formatDate(school.establishedDate)}
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground'>
                          Registration Number
                        </h4>
                        <p className='text-lg text-foreground'>
                          {school.registrationNumber || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5 border-b'>
                  <CardTitle className='flex items-center gap-2 text-foreground'>
                    <Mail className='h-5 w-5' />
                    Contact Information
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    How to get in touch with the institution
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                          <Mail className='h-4 w-4' />
                          Email Address
                        </h4>
                        <p className='text-lg text-foreground break-all'>
                          {school.email || "Not specified"}
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                          <Phone className='h-4 w-4' />
                          Phone Number
                        </h4>
                        <p className='text-lg text-foreground'>
                          {school.phoneMain || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                        <Globe className='h-4 w-4' />
                        Website
                      </h4>
                      {school.website ? (
                        <a
                          href={school.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-lg text-primary hover:text-primary/80 break-all transition-colors'>
                          {school.website}
                        </a>
                      ) : (
                        <p className='text-lg text-foreground'>Not specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5 border-b'>
                  <CardTitle className='flex items-center gap-2 text-foreground'>
                    <MapPin className='h-5 w-5' />
                    Location Information
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Physical address and location details
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-muted-foreground'>
                        Street Address
                      </h4>
                      <p className='text-lg text-foreground'>
                        {school.addressLine1 || "Not specified"}
                      </p>
                    </div>

                    <Separator />

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-muted-foreground'>
                        City
                      </h4>
                      <p className='text-lg text-foreground'>
                        {school.city || "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className='space-y-6'>
              {/* Primary Contact */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5 border-b'>
                  <CardTitle className='flex items-center gap-2 text-foreground'>
                    <User className='h-5 w-5' />
                    Primary Contact
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Main point of contact for the institution
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  {school.primaryContact ? (
                    <div className='flex flex-col items-center text-center space-y-4'>
                      {school.primaryContact.profilePhoto ? (
                        <img
                          src={school.primaryContact.profilePhoto}
                          alt={school.primaryContact.fullName}
                          className='h-20 w-20 rounded-full object-cover border-2 border-primary/20'
                        />
                      ) : (
                        <div className='h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20'>
                          <User className='h-10 w-10 text-primary' />
                        </div>
                      )}
                      <div className='space-y-2'>
                        <h3 className='font-semibold text-foreground text-xl'>
                          {school.primaryContact.fullName}
                        </h3>
                        <p className='text-muted-foreground break-all'>
                          {school.primaryContact.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='text-center py-6'>
                      <User className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                      <p className='text-muted-foreground'>
                        No primary contact assigned
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5 border-b'>
                  <CardTitle className='text-foreground'>
                    Institution Status
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Current operational status
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-muted-foreground'>
                        Status
                      </span>
                      <Badge
                        variant={
                          school.status === "active" ? "default" : "secondary"
                        }
                        className={
                          school.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }>
                        {school.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-muted-foreground'>
                        Type
                      </span>
                      <Badge
                        variant='outline'
                        className='border-primary text-primary'>
                        {getSchoolTypeLabel(school.type)}
                      </Badge>
                    </div>

                    <Separator />

                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-muted-foreground'>
                        Established
                      </span>
                      <span className='text-sm font-semibold text-foreground'>
                        {school.establishedDate
                          ? new Date(school.establishedDate).getFullYear()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className='border-2 shadow-lg'>
                <CardHeader className='bg-primary/5 border-b'>
                  <CardTitle className='text-foreground'>
                    Additional Info
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-4 text-sm'>
                    <div className='space-y-2'>
                      <span className='font-medium text-muted-foreground'>
                        Registration #:
                      </span>
                      <p className='text-foreground'>
                        {school.registrationNumber || "Not provided"}
                      </p>
                    </div>

                    <Separator />

                    <div className='space-y-2'>
                      <span className='font-medium text-muted-foreground'>
                        Motto:
                      </span>
                      <p className='text-foreground italic'>
                        {school.motto || "Not provided"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading school details:", error);
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='max-w-4xl mx-auto'>
          <Card className='border-destructive/20 bg-destructive/5'>
            <CardContent className='pt-6'>
              <div className='text-center space-y-4'>
                <Building2 className='h-12 w-12 text-destructive mx-auto' />
                <h2 className='text-xl font-semibold text-destructive'>
                  Failed to Load School Details
                </h2>
                <p className='text-muted-foreground'>
                  There was an error loading the school information. Please try
                  again later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
