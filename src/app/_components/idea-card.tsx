"use client";

import { useState } from "react";
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
import { CommentSection } from "./comment-section";
import type { Project } from "@/lib/types";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [votes, setVotes] = useState(project.votes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      // Remove vote
      setVotes(type === "up" ? votes - 1 : votes + 1);
      setUserVote(null);
    } else {
      // Change vote
      if (userVote === "up" && type === "down") {
        setVotes(votes - 2);
      } else if (userVote === "down" && type === "up") {
        setVotes(votes + 2);
      } else {
        setVotes(type === "up" ? votes + 1 : votes - 1);
      }
      setUserVote(type);
    }
  };

  return (
    <Link href={`/${project.id}`}>
      <Card className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={project.image || "/placeholder.svg?height=200&width=400"}
            alt={project.title}
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
        <CardContent className="flex-grow pt-4">
          <h2 className="mb-2 text-xl font-bold">{project.title}</h2>
          <p className="line-clamp-3 text-gray-600">{project.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={userVote === "up" ? "text-green-500" : ""}
              onClick={(e) => {
                e.stopPropagation();
                handleVote("up");
              }}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{votes}</span>
            <Button
              variant="ghost"
              size="icon"
              className={userVote === "down" ? "text-red-500" : ""}
              onClick={(e) => {
                e.stopPropagation();
                handleVote("down");
              }}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              className={bookmarked ? "text-blue-500" : ""}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async (e) => {
                e.stopPropagation();
                // Share functionality would go here
                await navigator.clipboard.writeText(
                  window.location.href + "?project=" + project.id,
                );
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-4 w-4" />
              <span className="ml-1 text-xs">{project.comments.length}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
