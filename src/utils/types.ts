export enum inputTypes {
  email = 'email',
  password = 'password',
  text = 'text',
}

export interface Poll {
  title: string;
  category: Category;
  description?: string;
  image?: string;
  options: PollOption[];
  creatorId: string;
  creator?: {
    email: string;
  };
  type: PollType;
  resultsVisibility: PollResultsVisibility;
  voteInterval: string;
  expireAt: Date | null;
  changeVote: boolean;
}

export enum Category {
  ALL = 'ALL',
  NONE = 'NONE',
  MOVIES_AND_SERIES = 'Кіно та серіали',
  MUSIC = 'Музика',
  SPORT = 'Спорт',
  TECHNOLOGIES = 'Технології',
  FASHION = 'Мода',
  COOKING = 'Кулінарія',
  TRAVEL = 'Подорожі',
  BOOKS = 'Книги',
  GAMES = 'Ігри',
  POLITICS = 'Політика',
  EDUCATION = 'Освіта',
  SCIENCE = 'Наука',
  ART = 'Мистецтво',
  HEALTH_AND_FITNESS = 'Здоров’я та фітнес',
  CARS = 'Автомобілі',
  PETS = 'Домашні улюбленці',
  ECOLOGY = 'Екологія',
  FINANCE_AND_INVESTMENTS = 'Фінанси та інвестиції',
  STARTUPS_AND_BUSINESS = 'Стартапи та бізнес',
  SOCIAL_ISSUES = 'Соціальні питання',
}

export interface PollOption {
  title: string;
  id: string;
  file: string | null;
  pollId: string;
}

export type AddPollOptionDraft = {
  title: string;
  file: string | null;
};

export type AddPollRequest = Omit<Poll, 'options' | 'creatorId' | 'creator'> & {
  creatorId?: string;
  options: AddPollOptionDraft[];
};

export enum PollType {
  MULTIPLE = 'MULTIPLE',
  IMAGE = 'IMAGE',
}

export enum PollResultsVisibility {
  ALWAYS = 'ALWAYS',
  AFTER_VOTE = 'AFTER_VOTE',
  AFTER_POLL_END = 'AFTER_EXPIRE',
}
