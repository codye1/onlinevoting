import multiple from '@public/iconMultiple.svg';
import img from '@public/iconImg.svg';
import formatDate from '@utils/formatDate.ts';
import { useNavigate } from 'react-router-dom';

export interface PollItem {
  id: string;
  title: string;
  resultsVisibility: string;
  type: string;
  createdAt: Date;
  expiresAt: Date | undefined;
  votes: number;
}

interface PollsList {
  polls: PollItem[];
}

const PollsList = ({ polls }: PollsList) => {
  const navigate = useNavigate();

  return (
    <div>
      {polls.map((p: PollItem) => {
        const isLive = !p.expiresAt || new Date(p.expiresAt) > new Date();
        return (
          <div
            key={p.id}
            className="w-full shadow-m  rounded p-[20px] mt-[15px] bg-foreground hover:bg-hover cursor-pointer flex items-center justify-between"
            onClick={() => {
              navigate('/poll/' + p.id);
            }}
          >
            <div className="flex items-center">
              <img
                className="w-[40px] h-[40px] mr-[10px]"
                src={p.type === 'img' ? img : multiple}
                alt=""
              />
              <span className="flex flex-col">
                <h1>{p.title}</h1>
                <h2 className="opacity-50 text-default">
                  {new Date(p.createdAt).toLocaleDateString()}
                </h2>
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-[100px] text-center">{p.votes}</span>
              <span className="w-[100px] text-center">
                {p.expiresAt ? formatDate(p.expiresAt) : '-'}
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
      })}
    </div>
  );
};

export default PollsList;
