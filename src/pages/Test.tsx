import { useGetUsersQuery } from '../reducer/api.ts';

const Test = () => {
  const { data } = useGetUsersQuery();

  console.log(data);

  return <div></div>;
};

export default Test;
