import Image from "next/image";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "../_components/comment-section";
import type { Project } from "@/lib/types";
import { projects } from "@/lib/data";

const IdeaPage = async ({ params }: { params: { slug: string } }) => {
  const project = projects.find((p) => p.id === params.slug)!;
  return (
    <Dialog defaultOpen>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24"
                alt={project.author}
              />
              <AvatarFallback>{project.author.charAt(0)}</AvatarFallback>
            </Avatar>
            Posted by {project.author} • {project.date}
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-4 h-64 w-full">
          <Image
            src={project.image || "/placeholder.svg?height=300&width=600"}
            alt={project.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <p>{project.description}</p>

          {project.resources && project.resources.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Resources</h3>
              <div className="space-y-2">
                {project.resources.map((resource, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{resource.type}</Badge>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {resource.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              {/* <Button
                                variant="outline"
                                size="sm"
                                className={userVote === "up" ? "text-green-500 border-green-500" : ""}
                                onClick={() => handleVote("up")}
                            >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Upvote
                            </Button> */}
              {/* <Button
                                variant="outline"
                                size="sm"
                                className={userVote === "down" ? "text-red-500 border-red-500" : ""}
                                onClick={() => handleVote("down")}
                            >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Downvote
                            </Button> */}
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button
                                variant="outline"
                                size="sm"
                                className={bookmarked ? "text-blue-500 border-blue-500" : ""}
                                onClick={() => setBookmarked(!bookmarked)}
                            >
                                <Bookmark className="h-4 w-4 mr-1" />
                                {bookmarked ? "Bookmarked" : "Bookmark"}
                            </Button> */}
              {/* <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href + "?project=" + project.id);
                                }}
                            >
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                            </Button> */}
            </div>
          </div>
        </div>

        <CommentSection comments={project.comments} projectId={project.id} />
      </DialogContent>
    </Dialog>
  );
};

export default IdeaPage;
