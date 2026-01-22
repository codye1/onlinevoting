import { formatTimeAgo } from '@utils/formatTimeAgo.ts';
import deadline from '@public/deadline.svg';
import Countdown from '@components/Countdown';

interface PollHeader {
  title: string;
  creator: string;
  startDate: string;
  expireAt: Date | null;
}

const PollHeader = ({ title, creator, startDate, expireAt }: PollHeader) => {
  return (
    <>
      <h1 className={'font-extrabold text-2xl'}>{title}</h1>
      <span className={'flex mt-[10px] font-medium text-sm'}>
        <h2 className={'mr-[10px]'}>by {creator}</h2>·
        <h3 className={'mx-[10px]'}>{formatTimeAgo(startDate)}</h3>
        {expireAt && (
          <span className="flex">
            ·
            <img
              src={deadline}
              alt="Deadline icon"
              className="ml-[10px] mr-[5px] w-[20px] h-[20px] icon-bw"
            />
            <Countdown targetDate={expireAt} />
          </span>
        )}
      </span>
    </>
  );
};

export default PollHeader;
