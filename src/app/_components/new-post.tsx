"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/melecules/file-upload";
import { useFileUpload, useUploadAuth } from "@/hooks/use-file-upload";
import { X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { newPostSchema } from "@/validation/post";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { upload } from "@imagekit/next";
import { Progress } from "@/components/ui/progress";
import { env } from "@/env";

type FormValues = z.infer<typeof newPostSchema>;

export function NewPostDialog() {
  const [open, setOpen] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const router = useRouter();

  const { refetch } = useUploadAuth();
  const { mutateAsync: uploadFileAsync } = useMutation({
    mutationFn: async (file: File) => {
      const { data } = await refetch();
      if (!data) return;
      const response = await upload({
        expire: data.expire,
        token: data.token,
        signature: data.signature,
        publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        file,
        fileName: file.name,
        onProgress: (event) => {
          const progress = Math.round((event.loaded / event.total) * 100);
          setImageUploadProgress(progress);
        },
      });
      return response;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      description: "",
      resources: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async (data) => {
      setOpen(false);
      toast("Idea has been created", {
        action: {
          label: "View",
          onClick: () => router.push(`/?p=${data.id}`),
        },
      });
    },
  });

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const fileUpload = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  async function onSubmit(values: FormValues) {
    let imageUrl: string | undefined = undefined;
    if (fileUpload[0].files[0]?.file) {
      const data = await uploadFileAsync(fileUpload[0].files[0]?.file as File);
      imageUrl = data?.url;
    }
    createPost.mutate({
      ...values,
      imageUrl: imageUrl,
    });
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
        {fileUpload[0].files[0]?.file && imageUploadProgress > 0 && <Progress value={imageUploadProgress} />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy title for your idea" {...field} />
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
                    <Textarea placeholder="Describe your project idea in detail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Resources</h4>
                <Button type="button" variant="outline" onClick={() => append({ title: "", url: "" })}>
                  + Add Resource
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-gray-500">
                  Add links to helpful resources like APIs, tutorials, or design inspiration
                </p>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
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
                    onClick={() => remove(index)}
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
