"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { redirect } from "next/navigation";

export function PostDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.push("/", {});
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
}
