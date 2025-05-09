"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";

export function PostDialogWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          const query = q ? `?q=${encodeURIComponent(q)}` : "";
          router.push(`/${query}`);
        }
      }}
    >
      {children}
    </Dialog>
  );
}
