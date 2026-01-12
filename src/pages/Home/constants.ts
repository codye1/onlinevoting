import img from '@public/img.svg';
import checkPool from '@public/checkPool.svg';
import {
  PollType,
} from '@utils/types.ts';

export const typeOptions: { label: string; value: PollType; icon?: string }[] =
  [
    {
      label: 'Кілька варіантів вибору',
      value: PollType.MULTIPLE,
      icon: checkPool,
    },
    { label: 'Голосування за зображеннями', value: PollType.IMAGE, icon: img },
  ];


export const filterOptions = [
              { label: 'Усі', value: 'ALL' },
              { label: 'Закриті', value: 'CLOSED' },
              { label: 'Активні', value: 'ACTIVE' },
              { label: 'Створені', value: 'CREATED' },
              { label: 'Брав участь', value: 'PARTICIPATED' },
            ]


            import { Category, PollResultsVisibility } from "@utils/types";

export const visibilityOptions: {
  label: string;
  value: PollResultsVisibility;
}[] = [
  { label: 'Завжди відкриті', value: PollResultsVisibility.ALWAYS },
  { label: 'Відкриті після голосу', value: PollResultsVisibility.AFTER_VOTE },
  {
    label: 'Відкриті після закінчення терміну дії',
    value: PollResultsVisibility.AFTER_POLL_END,
  },
];

export const voteIntervalOptions: {
  label: string;
  value: number | 'noInterval';
}[] = [
  { label: 'Без інтервалу', value: 'noInterval' },
  {
    label: 'Раз в хвилину',
    value: 60 * 1000,
  },
  {
    label: 'Раз в годину',
    value: 60 * 60 * 1000,
  },
  {
    label: 'Раз в день',
    value: 24 * 60 * 60 * 1000,
  },
  {
    label: 'Раз в тиждень',
    value: 7 * 24 * 60 * 60 * 1000,
  },
  {
    label: 'Раз в місяць',
    value: 30 * 24 * 60 * 60 * 1000,
  },
];
export const categoryOptions = [
  { label: 'Без категорії', value: Category.NONE },
  { label: 'Кіно та серіали', value: Category.MOVIES_AND_SERIES },
  { label: 'Музика', value: Category.MUSIC },
  { label: 'Спорт', value: Category.SPORT },
  { label: 'Технології', value: Category.TECHNOLOGIES },
  { label: 'Мода', value: Category.FASHION },
  { label: 'Кулінарія', value: Category.COOKING },
  { label: 'Подорожі', value: Category.TRAVEL },
  { label: 'Книги', value: Category.BOOKS },
  { label: 'Ігри', value: Category.GAMES },
  { label: 'Політика', value: Category.POLITICS },
  { label: 'Освіта', value: Category.EDUCATION },
  { label: 'Наука', value: Category.SCIENCE },
  { label: 'Мистецтво', value: Category.ART },
  { label: 'Здоров’я та фітнес', value: Category.HEALTH_AND_FITNESS },
  { label: 'Автомобілі', value: Category.CARS },
  { label: 'Домашні улюбленці', value: Category.PETS },
  { label: 'Екологія', value: Category.ECOLOGY },
  {
    label: 'Фінанси та інвестиції',
    value: Category.FINANCE_AND_INVESTMENTS,
  },
  { label: 'Стартапи та бізнес', value: Category.STARTUPS_AND_BUSINESS },
  { label: 'Соціальні питання', value: Category.SOCIAL_ISSUES },
];

