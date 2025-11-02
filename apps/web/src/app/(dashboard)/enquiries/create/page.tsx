"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/components/ui/form";
import { Input } from "@/src/app/components/ui/input";
import { Textarea } from "@/src/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/app/components/ui/popover";
import { CalendarIcon, Loader2, Copy, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/src/app/lib/utils";
import {
  createEnquirySchema,
  type CreateEnquiryInput,
} from "@/src/app/lib/validations/admission-validation";
import { Button } from "@/src/app/components/ui/button";
import toast from "react-hot-toast";
import { EnquiryClientService } from "@/src/app/lib/client-services/enquiry-client-service";

const enquirySources = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "walk_in", label: "Walk-in" },
  { value: "phone_call", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "advertisement", label: "Advertisement" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

const enquiryClientService = new EnquiryClientService();

const enquiryStatuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up Required" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "not_interested", label: "Not Interested" },
  { value: "on_hold", label: "On Hold" },
];

function generateEnquiryNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const timestamp = now.getTime().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Format: ENQ-YYYYMMDD-XXXX-ABCD
  return `ENQ-${year}${month}${day}-${timestamp}-${random}`;
}

export default function CreateEnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>();
  const [enquiryNumber, setEnquiryNumber] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate enquiry number on component mount
  useEffect(() => {
    setEnquiryNumber(generateEnquiryNumber());
  }, []);

  const form = useForm<CreateEnquiryInput>({
    resolver: zodResolver(createEnquirySchema),
    defaultValues: {
      enquiry_no: "",
      student_first_name: "",
      student_middle_name: "",
      student_last_name: "",
      guardian_first_name: "",
      guardian_last_name: "",
      contact_number: "",
      email: "",
      academic_year: new Date().getFullYear(),
      source_of_enquiry: "",
      status: "new",
      remarks: "",
      next_follow_up_date: undefined,
    },
  });

  // Update form with generated enquiry number
  useEffect(() => {
    if (enquiryNumber) {
      form.setValue("enquiry_no", enquiryNumber);
    }
  }, [enquiryNumber, form]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enquiryNumber);
      setCopied(true);
      toast.success("Enquiry number copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy enquiry number");
    }
  };

  const regenerateEnquiryNumber = () => {
    const newNumber = generateEnquiryNumber();
    setEnquiryNumber(newNumber);
    form.setValue("enquiry_no", newNumber);
  };

  async function onSubmit(data: CreateEnquiryInput) {
    setIsSubmitting(true);

    const submitPromise = enquiryClientService.createEnquiry({
      ...data,
      next_follow_up_date: nextFollowUpDate,
    });

    try {
      const result = await toast.promise(submitPromise, {
        loading: "Creating enquiry...",
        success: (result: any) =>
          result.success
            ? `Enquiry #${result.data.enquiry.enquiry_no} created successfully!`
            : "Enquiry created!",
        error: (err) =>
          err.message || "Failed to create enquiry. Please try again.", // ⬅️ The message/function for the rejected state
      });

      if (result.success) {
        form.reset();
        setNextFollowUpDate(undefined);
        setEnquiryNumber(generateEnquiryNumber());
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      // Error is already handled by toast.promise
      console.error("Enquiry creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='container mx-auto py-8 max-w-4xl'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
            New Student Enquiry
          </h1>
          <p className='text-muted-foreground text-lg'>
            Complete the form below to register a new student enquiry
          </p>
        </div>

        <Card className='border-l-4 border-l-primary shadow-lg'>
          <CardHeader className='pb-4 bg-muted/30'>
            <CardTitle className='text-2xl flex items-center justify-between'>
              <span>Enquiry Information</span>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-normal bg-primary text-primary-foreground px-3 py-1 rounded-full'>
                  Auto-generated
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              All fields marked with * are required
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'>
                {/* Enquiry Number - Auto-generated */}
                <FormField
                  control={form.control}
                  name='enquiry_no'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium flex items-center gap-2'>
                        Enquiry Number *
                        <span className='text-xs text-primary font-normal'>
                          (Auto-generated)
                        </span>
                      </FormLabel>
                      <div className='flex gap-2'>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            className='focus:ring-primary bg-muted/50 font-mono font-medium'
                          />
                        </FormControl>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={copyToClipboard}
                          disabled={!enquiryNumber}>
                          {copied ? (
                            <CheckCheck className='h-4 w-4' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={regenerateEnquiryNumber}>
                          Regenerate
                        </Button>
                      </div>
                      <FormDescription className='flex items-center gap-1'>
                        <span className='text-xs'>
                          Format: ENQ-YYYYMMDD-XXXX-ABCD
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Student Information Section */}
                <div className='space-y-6'>
                  <div className='border-b pb-4'>
                    <h3 className='text-lg font-semibold text-primary mb-4'>
                      Student Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='student_first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='John'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='student_middle_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Middle Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Michael'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='student_last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Doe'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Guardian Information Section */}
                  <div className='border-b pb-4'>
                    <h3 className='text-lg font-semibold text-primary mb-4'>
                      Guardian Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='guardian_first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Jane'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='guardian_last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Doe'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className='border-b pb-4'>
                    <h3 className='text-lg font-semibold text-primary mb-4'>
                      Contact Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='contact_number'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Contact Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='+1 (555) 123-4567'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='guardian@example.com'
                                type='email'
                                {...field}
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Enquiry Details */}
                  <div className='border-b pb-4'>
                    <h3 className='text-lg font-semibold text-primary mb-4'>
                      Enquiry Details
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='academic_year'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Academic Year *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min='2020'
                                max='2030'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                className='focus:ring-primary'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='source_of_enquiry'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>
                              Source of Enquiry *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='focus:ring-primary'>
                                  <SelectValue placeholder='Select source' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {enquirySources.map((source) => (
                                  <SelectItem
                                    key={source.value}
                                    value={source.value}>
                                    {source.label}
                                  </SelectItem>
                                ))}
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
                            <FormLabel className='text-sm font-medium'>
                              Status *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='focus:ring-primary'>
                                  <SelectValue placeholder='Select status' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {enquiryStatuses.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Next Follow-up Date */}
                      <FormField
                        control={form.control}
                        name='next_follow_up_date'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-sm font-medium'>
                              Next Follow-up Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal focus:ring-primary",
                                      !nextFollowUpDate &&
                                        "text-muted-foreground"
                                    )}>
                                    {nextFollowUpDate ? (
                                      format(nextFollowUpDate, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'>
                                <Calendar
                                  mode='single'
                                  selected={nextFollowUpDate}
                                  onSelect={setNextFollowUpDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <FormField
                    control={form.control}
                    name='remarks'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium'>
                          Remarks
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Additional notes or comments about this enquiry...'
                            className='resize-none focus:ring-primary min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className='flex justify-end gap-4 pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      form.reset();
                      setNextFollowUpDate(undefined);
                      setEnquiryNumber(generateEnquiryNumber());
                    }}
                    disabled={isSubmitting}>
                    Reset Form
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-primary hover:bg-primary/90 px-8'>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating Enquiry...
                      </>
                    ) : (
                      "Create Enquiry"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
