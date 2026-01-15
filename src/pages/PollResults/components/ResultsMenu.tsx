import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { PollResultsResponse } from '../../../reducer/api';

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
  const hasImages = poll.type === 'img';

  useEffect(() => {
    if (!hasImages && chartRef.current) {
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
  }, [hasImages]);

  return (
    <menu className="space-y-8">
      {hasImages ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-base sm:text-base">
          {optionsWithPercent.map((option, index) => (
            <div key={index} className="relative mt-3">
              <div
                className={`absolute rounded-b-md z-20 opacity-30 bottom-0 left-0 right-0 ${
                  option.percentValue === 100 ? 'rounded-t-md' : ''
                }`}
                style={{
                  height: `${option.percent}%`,
                  backgroundColor: option.color,
                }}
              ></div>
              <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center text-center z-20">
                <div className="rounded-md bg-black px-2 py-1 text-white border border-gray-300">
                  <div className="text-base sm:text-lg font-medium">
                    {option.percent} %
                  </div>
                  <div>({option.votes} голосів)</div>
                </div>
              </div>
              <div className="flex flex-col justify-between h-full rounded-md border border-gray-300">
                <div className="flex flex-grow h-48 px-3 py-2 mx-auto">
                  {option.file && (
                    <img
                      className="object-contain"
                      src={option.file}
                      alt={option.title}
                    />
                  )}
                </div>
                <div className="flex items-center h-10 mt-2 px-3 py-2 justify-center border-t border-gray-300 truncate">
                  <span className="truncate">{option.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="md:flex items-start">
          <div className="flex-grow">
            {optionsWithPercent.map((option, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center">
                  <div className="flex-grow flex items-center text-lg sm:text-base">
                    <span>{option.title}</span>
                  </div>
                  <div className="whitespace-nowrap ml-4">
                    <span>{option.percent}%</span>
                    <span> ({option.votes} голосів)</span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[#808080] mt-1">
                  <div
                    className="bg-[#808080]"
                    style={{ height: '18px' }}
                  ></div>
                  {option.percentValue > 0 && (
                    <div
                      className="rounded-r-lg absolute top-0"
                      style={{
                        height: '18px',
                        width: `${option.percent}%`,
                        backgroundColor: option.color,
                      }}
                    ></div>
                  )}
                </div>
              </div>
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
