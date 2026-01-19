import formatDate from '@utils/formatDate';
import { PollType } from '@utils/types';
import multiple from '@public/iconMultiple.svg';
import img from '@public/iconImg.svg';
import participants from '@public/participants.svg';
import deadlineIcon from '@public/deadline.svg';

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
  const deadline = expireAt ? formatDate(expireAt) : null;
  return (
    <div
      key={id}
      className="w-full shadow-m  rounded p-[20px] mt-[15px] bg-foreground hover:bg-hover cursor-pointer flex items-center justify-between  max-sm:flex-col max-sm:items-start"
      onClick={onClick}
    >
      <div className="flex items-center">
        <img
          className="w-[40px] h-[40px] mr-[10px] icon-bw"
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

      <div className="flex items-center max-sm:mt-[20px] max-sm:justify-between max-sm:w-full">
        <span className="w-[100px] text-center height-[30px] flex items-center justify-center">
          <img
            src={participants}
            alt="Participants"
            className="mr-[5px] w-[20px] h-[20px] sm:hidden icon-bw"
          />

          {votes}
        </span>
        <span
          className={`w-[100px] text-center height-[30px] flex items-center justify-center ${deadline ? '' : 'max-sm:hidden'}`}
        >
          <img
            src={deadlineIcon}
            alt="Deadline"
            className="mr-[5px] w-[20px] h-[20px] sm:hidden icon-bw"
          />
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
