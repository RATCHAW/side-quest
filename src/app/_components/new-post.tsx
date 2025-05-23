"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/melecules/file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import { CirclePlus, Loader, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { newPostSchema } from "@/validation/post";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { upload } from "@imagekit/next";
import { Progress } from "@/components/ui/progress";
import { env } from "@/env";
import { useSession } from "@/lib/auth-client";
import { usePostMutations } from "./use-post-mutations";
import { postSearchParams } from "./search-params";
import { useQueryStates } from "nuqs";

type FormValues = z.infer<typeof newPostSchema>;

export function NewPostDialog() {
  const [open, setOpen] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const { data: userSession } = useSession();
  const { createPost, editPost } = usePostMutations();
  const [searchParams, setSearchParams] = useQueryStates(postSearchParams);

  const isEditing = !!searchParams.post_edit_id;

  const uploadAuth = api.upload.getAuthCredentials.useQuery(undefined, {
    staleTime: 1000 * 60,
    enabled: false,
  });

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const { data } = api.post.getById.useQuery(
    { id: searchParams.post_edit_id! },
    { enabled: !!searchParams.post_edit_id },
  );
  const [state, uploadActions] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  useEffect(() => {
    if (data) {
      uploadActions.addImageByUrl(data.imageUrl || undefined, "unedited_image_hodler");
      form.setValue("title", data.title);
      form.setValue("description", data.description);
      form.setValue("resources", data.resources);
    }
  }, [searchParams.post_edit_id, data]);

  const { mutateAsync: uploadFileAsync } = useMutation({
    mutationFn: async (file: File) => {
      const { data: uploadAuthData } = await uploadAuth.refetch();
      if (!uploadAuthData) return;
      const response = await upload({
        expire: uploadAuthData.expire,
        token: uploadAuthData.token,
        signature: uploadAuthData.signature,
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

  async function onSubmit(values: FormValues) {
    if (!userSession?.user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    let imageUrl: string | undefined = undefined;
    if (state.files[0]?.file && state.files[0].file.name !== "unedited_image_hodler") {
      const data = await uploadFileAsync(state.files[0]?.file as File);
      if (data) {
        imageUrl = data.url;
      }
    }

    if (searchParams.post_edit_id) {
      editPost.mutate(
        {
          id: searchParams.post_edit_id,
          ...values,
          imageUrl,
        },
        {
          onSuccess() {
            setOpen(false);
            form.reset();

            setImageUploadProgress(0);
            uploadActions.clearFiles();
          },
        },
      );
    } else {
      createPost.mutate(
        {
          ...values,
          imageUrl: imageUrl,
        },
        {
          onSuccess() {
            setOpen(false);
            form.reset();
            setImageUploadProgress(0);
            uploadActions.clearFiles();
          },
        },
      );
    }
  }

  return (
    <Dialog
      open={open || !!data?.id}
      onOpenChange={(open) => {
        if (!open) {
          if (isEditing) {
            form.reset();
            uploadActions.clearFiles();
            setImageUploadProgress(0);
          }
          void setSearchParams({ post_edit_id: null });
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <CirclePlus /> <span className="max-md:hidden">Share New Idea</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Your Project Idea" : "Share Your Project Idea"}</DialogTitle>
        </DialogHeader>
        <FileUpload fileUpload={[state, uploadActions]} maxSizeMB={maxSizeMB} />
        {state.files[0]?.file && imageUploadProgress > 0 && <Progress value={imageUploadProgress} />}

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
                <div key={field.id} className="flex gap-2">
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

            <Button disabled={createPost.isPending || editPost.isPending} type="submit">
              {(createPost.isPending || editPost.isPending) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Post"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
