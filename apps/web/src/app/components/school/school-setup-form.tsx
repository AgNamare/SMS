// src/app/components/school/school-setup-form.tsx
"use client";

import { useState, useRef, useEffect, useActionState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  schoolSchema,
  SchoolInput,
} from "@/src/app/lib/validations/school-schema";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import {
  Upload,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Search,
} from "lucide-react";

interface SchoolSetupFormProps {
  initialData?: any;
  users: Array<{
    id: number;
    fullName: string;
    email: string;
    profilePhoto?: string;
  }>;
}

export function SchoolSetupForm({
  initialData,
  users,
  formAction,
}: SchoolSetupFormProps & { formAction: any }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use action state for form submission
  const [state, formHandler, isPending] = useActionState(formAction, null);

  const form = useForm<SchoolInput>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      legalName: initialData?.legalName || "",
      displayName: initialData?.displayName || "",
      type: initialData?.type || "secondary",
      status: initialData?.status || "active",
      registrationNumber: initialData?.registrationNumber || "",
      establishedDate: initialData?.establishedDate
        ? new Date(initialData.establishedDate).toISOString().split("T")[0]
        : "",
      email: initialData?.email || "",
      phoneMain: initialData?.phoneMain || "",
      website: initialData?.website || "",
      addressLine1: initialData?.addressLine1 || "",
      city: initialData?.city || "",
      logoUrl: initialData?.logoUrl || "",
      motto: initialData?.motto || "",
      primaryContactId: initialData?.primaryContact?.id || undefined,
    },
  });

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Handle action state changes
  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      form.reset();
      setPreviewUrl("");
      setSearchQuery("");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, form]);

  // Handle file selection for logo
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const toastId = toast.loading("Uploading school logo...", {
      duration: Infinity,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Upload failed");
      }

      form.setValue("logoUrl", json.data.secure_url);
      toast.success("School logo uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", {
        id: toastId,
      });
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setPreviewUrl("");
    form.setValue("logoUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // Get selected user for display
  const selectedUser = users.find(
    (user) => user.id === form.watch("primaryContactId")
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <div className='flex items-center justify-center gap-3'>
          <Building2 className='h-8 w-8 text-primary' />
          <h1 className='text-3xl font-bold text-foreground'>School Setup</h1>
        </div>
        <p className='text-muted-foreground'>
          Configure your school's basic information and institutional details
        </p>
      </div>

      <Card className='border-2'>
        <CardHeader className='bg-muted/50'>
          <CardTitle className='flex items-center gap-2 text-foreground'>
            <Building2 className='h-5 w-5' />
            Institution Details
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Basic information about your educational institution
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form action={formHandler} className='space-y-6'>
              <div className='space-y-4'>
                <FormLabel className='text-base font-semibold text-foreground'>
                  School Logo
                </FormLabel>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    uploading
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                  }`}
                  onClick={triggerFileInput}>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept='image/*'
                    className='hidden'
                  />

                  {previewUrl || form.watch("logoUrl") ? (
                    <div className='relative inline-block'>
                      <img
                        src={previewUrl || form.watch("logoUrl")}
                        alt='School logo preview'
                        className='h-32 w-32 object-contain rounded-lg mx-auto border'
                      />
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors'>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      <Upload className='mx-auto h-12 w-12 text-muted-foreground' />
                      <div>
                        <p className='text-lg font-medium text-foreground'>
                          {uploading ? "Uploading..." : "Upload School Logo"}
                        </p>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Click to choose a file or drag and drop
                        </p>
                        <p className='text-xs text-muted-foreground mt-2'>
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Hidden input for logo URL */}
                <input
                  type='hidden'
                  name='logoUrl'
                  value={form.watch("logoUrl") || ""}
                />
              </div>

              {/* School Information Section */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground border-b pb-2'>
                  School Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='legalName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          Legal Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Official legal name of the school'
                            className='bg-background border-input'
                            {...field}
                            name='legalName' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='displayName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          Display Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Name used for display purposes'
                            className='bg-background border-input'
                            {...field}
                            name='displayName' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          School Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          name='type'>
                          <FormControl>
                            <SelectTrigger className='bg-background border-input'>
                              <SelectValue placeholder='Select school type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='primary'>
                              Primary School
                            </SelectItem>
                            <SelectItem value='secondary'>
                              Secondary School
                            </SelectItem>
                            <SelectItem value='tertiary'>
                              Tertiary Institution
                            </SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          name='status' // Add name attribute
                        >
                          <FormControl>
                            <SelectTrigger className='bg-background border-input'>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='inactive'>Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='registrationNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          Registration Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., REG-2025-001'
                            className='bg-background border-input'
                            {...field}
                            name='registrationNumber' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='establishedDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground'>
                          Established Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            className='bg-background border-input'
                            {...field}
                            name='establishedDate' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='motto'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground'>
                        School Motto
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Inspiring motto or tagline'
                          className='bg-background border-input'
                          {...field}
                          name='motto' // Add name attribute
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information Section */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  Contact Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground flex items-center gap-2'>
                          <Mail className='h-4 w-4' />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='info@school.edu'
                            className='bg-background border-input'
                            {...field}
                            name='email' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='phoneMain'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-foreground flex items-center gap-2'>
                          <Phone className='h-4 w-4' />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='+254700000000'
                            className='bg-background border-input'
                            {...field}
                            name='phoneMain' // Add name attribute
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground'>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://school.edu'
                          className='bg-background border-input'
                          {...field}
                          name='website' // Add name attribute
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information Section */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2'>
                  <MapPin className='h-4 w-4' />
                  Location Information
                </h3>

                <FormField
                  control={form.control}
                  name='addressLine1'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground'>
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='123 School Street'
                          className='bg-background border-input'
                          {...field}
                          name='addressLine1' // Add name attribute
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground'>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='City name'
                          className='bg-background border-input'
                          {...field}
                          name='city' // Add name attribute
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Primary Contact Section */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  Primary Contact Person
                </h3>

                <FormField
                  control={form.control}
                  name='primaryContactId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-foreground'>
                        Primary Contact
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                        name='primaryContactId' // Add name attribute
                      >
                        <FormControl>
                          <SelectTrigger className='bg-background border-input'>
                            <SelectValue placeholder='Select primary contact person'>
                              {selectedUser && (
                                <div className='flex items-center gap-2'>
                                  {selectedUser.profilePhoto ? (
                                    <img
                                      src={selectedUser.profilePhoto}
                                      alt={selectedUser.fullName}
                                      className='h-6 w-6 rounded-full object-cover'
                                    />
                                  ) : (
                                    <div className='h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center'>
                                      <User className='h-3 w-3 text-primary' />
                                    </div>
                                  )}
                                  <span>{selectedUser.fullName}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-80'>
                          {/* Search Input */}
                          <div className='p-2 border-b'>
                            <div className='relative'>
                              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                              <Input
                                placeholder='Search users...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='pl-8'
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Users List */}
                          <div className='max-h-60 overflow-y-auto'>
                            {filteredUsers.length === 0 ? (
                              <div className='py-6 text-center text-sm text-muted-foreground'>
                                No users found
                              </div>
                            ) : (
                              filteredUsers.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id.toString()}>
                                  <div className='flex items-center gap-3 py-1'>
                                    {user.profilePhoto ? (
                                      <img
                                        src={user.profilePhoto}
                                        alt={user.fullName}
                                        className='h-8 w-8 rounded-full object-cover'
                                      />
                                    ) : (
                                      <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <User className='h-4 w-4 text-primary' />
                                      </div>
                                    )}
                                    <div className='flex-1 min-w-0'>
                                      <div className='font-medium text-foreground truncate'>
                                        {user.fullName}
                                      </div>
                                      <div className='text-xs text-muted-foreground truncate'>
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className='flex justify-end pt-6 border-t'>
                <Button
                  type='submit'
                  disabled={isPending || uploading}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 h-12 text-base'>
                  {isPending ? "Saving..." : "Save School Details"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
