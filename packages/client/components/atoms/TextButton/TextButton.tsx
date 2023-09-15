import { Button } from "antd";

interface TextButtonProps {
  text: string;
  onClick: () => void;
}

export default function TextButton({
  text,
  onClick,
}: TextButtonProps): JSX.Element {
  return (
    <Button
      type="primary"
      className="font-text font-base text-snowStorm-2 bg-polarNight-3"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
