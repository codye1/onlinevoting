import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { PollResultsResponse } from '@reducer/api/slices/pollSlice.ts';
import { PollType } from '@utils/types';
import ImageOption from './ImageOption';
import MultipleOption from './MultipleOption';

interface EnhancedOption {
  title: string;
  votes: number;
  percent: string;
  percentValue: number;
  color: string;
  file: string | null;
}

type IResultsMenu = {
  poll: PollResultsResponse;
};

const colors = [
  '#3EB991',
  '#FF7563',
  '#AA66CC',
  '#FFBB33',
  '#FF8800',
  '#33B5E5',
  '#3EB991',
];

const ResultsMenu = ({ poll }: IResultsMenu) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );

  const optionsWithPercent: EnhancedOption[] = poll.options.map(
    (option, index) => {
      const percent = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
      return {
        title: option.title,
        votes: option.votes,
        percent: percent.toFixed(2),
        percentValue: percent,
        color: colors[index % colors.length],
        file: option.file,
      };
    },
  );

  useEffect(() => {
    if (poll.type !== PollType.IMAGE && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: optionsWithPercent.map((option) => option.title),
            datasets: [
              {
                data: optionsWithPercent.map((option) => option.votes),
                backgroundColor: optionsWithPercent.map(
                  (option) => option.color,
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [poll.type]);

  return (
    <menu className="space-y-8">
      {poll.type === PollType.IMAGE && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 text-base sm:text-base">
          {optionsWithPercent.map((option, index) => (
            <ImageOption option={option} key={index} />
          ))}
        </div>
      )}
      {poll.type === PollType.MULTIPLE && (
        <div className="md:flex items-start">
          <div className="flex-grow">
            {optionsWithPercent.map((option, index) => (
              <MultipleOption option={option} key={index} />
            ))}
          </div>
          <div className="flex-shrink-0 relative">
            <div className="mt-8 md:mt-0 md:ml-8 w-72 h-72 mx-auto">
              <canvas
                ref={chartRef}
                id="pollResultsPieChart"
                width="288"
                height="288"
                style={{
                  display: 'block',
                  boxSizing: 'border-box',
                  height: '288px',
                  width: '288px',
                }}
              ></canvas>
            </div>
          </div>
        </div>
      )}

      <div className="mt-[15px] ">
        <span>Всього голосів: {totalVotes}</span>
      </div>
    </menu>
  );
};

export default ResultsMenu;
