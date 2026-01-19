import PollItemSkeleton from './PollItemSkeleton';

const SkeletonPollsList = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <PollItemSkeleton key={index} />
  ));
};

export default SkeletonPollsList;
