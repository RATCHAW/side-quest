import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import type { Variable } from "lucide-react";
import { toast } from "sonner";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      mutations: {
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
