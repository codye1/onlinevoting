import { useNavigate } from 'react-router-dom';
import PollItem, { IPollItem } from './PollItem';

interface PollsList {
  polls: IPollItem[];
}

const PollsList = ({ polls }: PollsList) => {
  const navigate = useNavigate();

  return (
    <div>
      {polls.map((p: IPollItem) => (
        <PollItem
          {...p}
          key={p.id}
          onClick={() => {
            navigate('/poll/' + p.id);
          }}
        />
      ))}
    </div>
  );
};

export default PollsList;
