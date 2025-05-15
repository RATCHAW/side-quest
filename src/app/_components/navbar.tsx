"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./profile-dropdown";
import { authClient } from "@/lib/auth-client";
import { NewPostDialog } from "./new-post";
import { useQueryState } from "nuqs";
import { SignInDialog } from "./signin-dialog";
export function Navbar() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
    throttleMs: 500,
  });

  const { data } = authClient.useSession();
  return (
    <header className="sticky top-0 z-10 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="text-xl font-bold">SideQuest</div>
        <div className="relative mx-4 w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search project ideas..."
            className="w-full pl-10"
          />
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <NewPostDialog />
          {data?.user ? <ProfileDropdown user={data.user} /> : <SignInDialog />}
        </div>
      </div>
    </header>
  );
}
