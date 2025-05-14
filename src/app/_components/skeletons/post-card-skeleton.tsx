import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function PostCardSkeleton() {
  return (
    <div>
      <Card className="flex h-full flex-col gap-4 transition-shadow">
        <div className="px-4">
          <div className="relative h-48 w-full">
            <Skeleton className="h-full w-full rounded-3xl" />
          </div>
        </div>
        <CardContent className="flex-grow pt-4">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="w-full">
          <Skeleton className="h-8 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
