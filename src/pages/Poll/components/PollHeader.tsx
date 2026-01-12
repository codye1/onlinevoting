import { formatTimeAgo } from '@utils/formatTimeAgo.ts';

interface PollHeader {
  title: string;
  creator: string;
  startDate: string;
}

const PollHeader = ({ title, creator, startDate }: PollHeader) => {
  return (
    <>
      <h1 className={'font-extrabold text-2xl'}>{title}</h1>
      <span className={'flex mt-[10px] font-medium text-sm'}>
        <h2 className={'mr-[10px]'}>by {creator}</h2>·
        <h3 className={'ml-[10px]'}>{formatTimeAgo(startDate)}</h3>
      </span>
    </>
  );
};

export default PollHeader;
