const Errors = ({ errors }: { errors: string[] }) => {
  return (
    <ul className="text-start text-sm text-red-500">
      {errors.map((error, index) => (
        <li key={index + error}>{error}</li>
      ))}
    </ul>
  );
};

export default Errors;
