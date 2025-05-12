"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NewComment } from "./new-comment";

interface NewCommentReplyProps {
  postId: string;
  parentId: string;
}

export const NewCommentReply = ({ postId, parentId }: NewCommentReplyProps) => {
  const [showReply, setShowReply] = useState(false);
  return (
    <div>
      {showReply && <NewComment parentId={parentId} postId={postId} />}
      <Button
        onClick={() => setShowReply(true)}
        variant="ghost"
        size="sm"
        className="mt-2 text-gray-500"
      >
        Reply
      </Button>
    </div>
  );
};
