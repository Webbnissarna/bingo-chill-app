interface ToggleProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

export default function Toggle({
  checked,
  onChange,
}: ToggleProps): JSX.Element {
  return (
    <input
      className="w-7 h-7 outline-none border-none rounded bg-polarNight-0 text-frost-3 focus:border-none cursor-pointer active:text-frost-2 transition"
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.currentTarget.checked)}
    />
  );
}
