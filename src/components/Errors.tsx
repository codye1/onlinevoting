import errorIcon from '../public/error.svg';

const Errors = ({ errors }: { errors: string[] }) => {
  return (
    <ul className="text-start text-sm text-danger ">
      {errors.map((error, index) => (
        <li
          key={index + error}
          className=" h-[25px] flex items-center text-center"
        >
          <img
            src={errorIcon}
            alt="error"
            className="inline mr-1 w-[16px] h-[16px]"
          />
          {error}
        </li>
      ))}
    </ul>
  );
};

export default Errors;
