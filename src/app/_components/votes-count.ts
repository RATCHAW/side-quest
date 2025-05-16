import type { Vote } from "@prisma/client";

interface VotesCountProps {
  currentVoteCount: number;
  userCurrentVote: false | Vote | undefined;
  voteType: Vote;
}

export const calculateVotesCount = ({ currentVoteCount, userCurrentVote, voteType }: VotesCountProps) => {
  const shouldRemoveVote = userCurrentVote === voteType;
  const voteCase = shouldRemoveVote
    ? `remove_${userCurrentVote}`
    : userCurrentVote
      ? `change_${userCurrentVote}_to_${voteType}`
      : `add_${voteType}`;

  switch (voteCase) {
    case "remove_UP":
      return Math.max(0, currentVoteCount - 1);
    case "remove_DOWN":
      return currentVoteCount + 1;
    case "change_UP_to_DOWN":
      return Math.max(0, currentVoteCount - 2);
    case "change_DOWN_to_UP":
      return currentVoteCount + 2;
    case "add_UP":
      return currentVoteCount + 1;
    case "add_DOWN":
      return Math.max(0, currentVoteCount - 1);
    default:
      return currentVoteCount;
  }
};
