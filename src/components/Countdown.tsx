import useTimeLeft from '@hooks/useTimeLeft';

interface ICountdown {
  targetDate: Date | string;
}

const Countdown = ({ targetDate }: ICountdown) => {
  const timeLeft = useTimeLeft(targetDate);

  if (timeLeft.isOver) {
    return <span>Час вийшов</span>;
  }

  return (
    <span>
      {timeLeft.days}д {timeLeft.hours}ч {timeLeft.minutes}м {timeLeft.seconds}с
    </span>
  );
};

export default Countdown;
