import formatDate from '@utils/formatDate';
import { PollType } from '@utils/types';
import multiple from '@public/iconMultiple.svg';
import img from '@public/iconImg.svg';

export interface IPollItem {
  id: string;
  title: string;
  resultsVisibility: string;
  type: PollType;
  createdAt: Date;
  expireAt: Date | undefined;
  votes: number;

  onClick?: () => void;
}

const PollItem = ({
  id,
  type,
  title,
  createdAt,
  expireAt,
  votes,
  onClick,
}: IPollItem) => {
  const isLive = !expireAt || new Date(expireAt) > new Date();

  return (
    <div
      key={id}
      className="w-full shadow-m  rounded p-[20px] mt-[15px] bg-foreground hover:bg-hover cursor-pointer flex items-center justify-between"
      onClick={onClick}
    >
      <div className="flex items-center">
        <img
          className="w-[40px] h-[40px] mr-[10px]"
          src={type === PollType.IMAGE ? img : multiple}
          alt=""
        />
        <span className="flex flex-col">
          <h1>{title}</h1>
          <h2 className="opacity-50 text-default">
            {new Date(createdAt).toLocaleDateString()}
          </h2>
        </span>
      </div>

      <div className="flex items-center">
        <span className="w-[100px] text-center">{votes}</span>
        <span className="w-[100px] text-center">
          {expireAt ? formatDate(expireAt) : '-'}
        </span>
        <span className="w-[100px] text-center flex items-center justify-center">
          <span
            className={`w-[8px] h-[8px] rounded-full mr-[5px] ${
              isLive
                ? 'bg-green-500 shadow-[0_0_10px_green]'
                : 'bg-red-500 shadow-[0_0_10px_red]'
            }`}
          ></span>
          {isLive ? 'Live' : 'Closed'}
        </span>
      </div>
    </div>
  );
};

export default PollItem;
