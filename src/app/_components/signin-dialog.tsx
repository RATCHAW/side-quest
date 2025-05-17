import { Discord, Google } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Loader, LogIn } from "lucide-react";
import { useQueryState, useQueryStates } from "nuqs";
import { postSearchParams } from "./search-params";

export const SignInDialog = () => {
  const [searchParams, setSearchParams] = useQueryStates(postSearchParams);

  const {
    mutate: signIn,
    isPending,
    variables,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ provider }: { provider: "discord" | "google" }) =>
      authClient.signIn.social({
        provider,
      }),
  });

  return (
    <Dialog
      open={searchParams.signin ?? false}
      onOpenChange={(open) => {
        void setSearchParams({ signin: open ? true : null });
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <LogIn />
          <span className="max-md:hidden">Sign in</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>Login with your Discord or Google account</DialogDescription>
        </DialogHeader>
        <Button onClick={() => signIn({ provider: "discord" })} disabled={isPending}>
          {isPending && variables.provider === "discord" ? <Loader className="animate-spin" /> : <Discord />}
          Login with Discord
        </Button>

        <Button onClick={() => signIn({ provider: "google" })} disabled={isPending}>
          {isPending && variables.provider === "google" ? <Loader className="animate-spin" /> : <Google />}
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// {isPending ? <Loader className="animate-spin" /> : <LogIn />}{" "}
