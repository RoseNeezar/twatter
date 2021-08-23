import { ChangeEvent, FC } from "react";

interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  disable?: boolean;
  setValue: (
    name: string
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputGroup: FC<InputGroupProps> = ({
  className,
  type,
  placeholder,
  value,
  error,
  setValue,
  disable,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        disabled={disable}
        className={` w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 ${
          error && "border-red-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={setValue(type)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;
