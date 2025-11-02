// src/app/components/user-create-popup.tsx
"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createUserSchema,
  CreateUserInput,
} from "@/src/app/lib/validations/user-schema";
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
import { Plus, Upload, X } from "lucide-react";

interface UserCreatePopupProps {
  onUserCreated?: () => void;
}

export function UserCreatePopup({ onUserCreated }: UserCreatePopupProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePhoto: "",
    },
  });

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload file
    uploadFile(file);
  };

  // Upload file to Cloudinary
  const uploadFile = async (file: File) => {
    setUploading(true);
    const toastId = toast.loading("Uploading image...", { duration: Infinity });

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

      // Set the profile photo URL in the form
      form.setValue("profilePhoto", json.data.secure_url);

      toast.success("Image uploaded successfully!", {
        id: toastId,
        duration: 3000,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", {
        id: toastId,
        duration: 5000,
      });
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setPreviewUrl("");
    form.setValue("profilePhoto", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: CreateUserInput) => {
    setLoading(true);
    const toastId = toast.loading("Creating user...", { duration: Infinity });

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          profilePhoto: data.profilePhoto,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to create user");
      }

      toast.success("User created successfully!", {
        id: toastId,
        duration: 4000,
      });

      form.reset();
      setPreviewUrl("");
      setOpen(false);

      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create user",
        {
          id: toastId,
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setPreviewUrl("");
  };

  return (
    <div>
      <Button
        type='submit'
        className='bg-primary hover:opacity-85 text-sm'
        onClick={() => setOpen(true)}
        disabled={loading || uploading}>
        <Plus size={12} />
        Create New User
      </Button>

      {open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Create New User</h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                {/* Profile Photo Upload */}
                <div className='space-y-2'>
                  <FormLabel>Profile Photo</FormLabel>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      uploading
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={triggerFileInput}>
                    <input
                      type='file'
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept='image/*'
                      className='hidden'
                    />

                    {previewUrl ? (
                      <div className='relative inline-block'>
                        <img
                          src={previewUrl}
                          alt='Preview'
                          className='h-24 w-24 rounded-full object-cover mx-auto'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        <Upload className='mx-auto h-8 w-8 text-gray-400' />
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {uploading ? "Uploading..." : "Select photo"}
                          </p>
                          <p className='text-xs text-gray-500'>
                            Click to choose a file
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden input for form validation */}
                  <FormField
                    control={form.control}
                    name='profilePhoto'
                    render={({ field }) => (
                      <FormItem className='hidden'>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* First Name and Last Name in same row */}
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='First name'
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Last name'
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter email'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter password'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm password'
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex gap-4 pt-4 justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleClose}
                    disabled={loading || uploading}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-primary hover:opacity-70'
                    disabled={loading || uploading}>
                    {loading ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
