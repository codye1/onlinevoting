import { Category, PollResultsVisibility, PollType } from '@utils/types';

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type OptionDraft = { file: string | null; title: string };

export type AddPollFormValues = {
  title: string;
  description: string;
  image: string;
  type: PollType;
  options: OptionDraft[];
  resultsVisibility: PollResultsVisibility;
  category: Category;
  changeVote: boolean;
  voteInterval: string;
  closePollOnDate: boolean;
  expireAt: Value;
};
