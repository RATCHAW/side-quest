import type { Vote } from "@prisma/client";

interface VotesCountProps {
  currentVoteCount: number;
  userCurrentVote: Vote | undefined;
  voteType: "UP" | "DOWN" | "REMOVE";
}

export const calculateVotesCount = ({ currentVoteCount, userCurrentVote, voteType }: VotesCountProps) => {
  let count = currentVoteCount;
  if (voteType === "REMOVE") {
    count = userCurrentVote === "UP" ? count - 1 : count + 1;
  } else if (voteType === "UP") {
    // count = count + 2;
    if (userCurrentVote === "DOWN") {
      count = count + 2;
    } else {
      count = count + 1;
    }
  } else if (voteType === "DOWN") {
    if (userCurrentVote === "UP") {
      count = count - 2;
    } else {
      count = count - 1;
    }
  }
  return count;
};
