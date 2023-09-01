interface TextButtonProps {
  text: string;
  onClick: () => void;
}

export default function TextButton({
  text,
  onClick,
}: TextButtonProps): JSX.Element {
  return (
    <button
      className="font-text font-base text-snowStorm-2 bg-polarNight-3 px-3 py-1 rounded-lg hover:bg-polarNight-2 active:bg-polarNight-1 transition"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
