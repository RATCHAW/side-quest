"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/melecules/file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url("Please enter a valid URL").or(z.string().length(0)),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function NewPostDialog() {
  const [open, setOpen] = useState(false);

  // Setup form with React Hook Form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      resources: [],
    },
  });

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const fileUpload = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  // Form submission handler
  function onSubmit(values: FormValues) {
    console.log("Form data:", values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Share New Idea</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Share Your Project Idea</DialogTitle>
        </DialogHeader>
        <FileUpload fileUpload={fileUpload} maxSizeMB={maxSizeMB} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a catchy title for your idea"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project idea in detail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resources section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Resources</h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentResources = form.getValues("resources") || [];
                    form.setValue("resources", [
                      ...currentResources,
                      { title: "", url: "" },
                    ]);
                  }}
                >
                  + Add Resource
                </Button>
              </div>

              {form.watch("resources")?.length === 0 && (
                <p className="text-sm text-gray-500">
                  Add links to helpful resources like APIs, tutorials, or design
                  inspiration
                </p>
              )}

              {form.watch("resources")?.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`resources.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="E.g. GitHub Repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`resources.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      const currentResources = form.getValues("resources");
                      form.setValue(
                        "resources",
                        currentResources.filter((_, i) => i !== index),
                      );
                    }}
                    className="self-start text-red-500"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
