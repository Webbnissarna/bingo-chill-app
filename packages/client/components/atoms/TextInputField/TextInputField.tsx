interface TextInputFieldProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function TextInputField({
  value,
  onChange,
}: TextInputFieldProps): JSX.Element {
  return (
    <input
      className="w-full font-text text-base text-snowStorm-2 outline-none border-none shadow-none bg-polarNight-0 rounded px-2 py-1 focus:bg-polarNight-2 transition"
      type="text"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
