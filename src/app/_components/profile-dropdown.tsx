import { BoltIcon, ChevronDownIcon, Layers2Icon, Loader, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "better-auth";

import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ProfileDropdown = ({ user }: { user: User }) => {
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate: signOut, isPending } = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await utils.post.all.invalidate();
      await utils.invalidate(undefined, { queryKey: ["session"] });
    },
  });

  const onSignOutClick = () => {
    router.push("/");
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.image || undefined} alt="Profile image" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">{user.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <Link href="/myposts">
              <span>My Posts</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <Link href="/bookmarks">
              <span>Bookmarks</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOutClick}>
          {isPending ? (
            <Loader className="animate-spin" />
          ) : (
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          )}
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
