import { runCallbackIfInteger } from "@/utils/inputValidators";

interface IntegerInputFieldProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function IntegerInputField({
  value,
  onChange,
}: IntegerInputFieldProps): JSX.Element {
  return (
    <input
      className="w-full font-text text-base text-snowStorm-2 outline-none border-none shadow-none bg-polarNight-0 rounded px-2 py-1 focus:bg-polarNight-2 transition"
      type="number"
      value={value}
      onChange={(e) => runCallbackIfInteger(e.currentTarget.value, onChange)}
    />
  );
}
