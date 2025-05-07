"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import { NewPostDialog } from "./new-post";

export function Navbar() {
  const [q, setQ] = useQueryState("q", { defaultValue: "" });

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const { data } = authClient.useSession();
  return (
    <header className="sticky top-0 z-10 border-b bg-white">
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
        <div>
          <NewPostDialog />
          {data?.user ? (
            <ProfileDropdown user={data.user} />
          ) : (
            <Button onClick={signIn}>Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
}
