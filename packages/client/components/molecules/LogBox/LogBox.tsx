import MarkdownText from "@/components/atoms/MarkdownText/MarkdownText";

export interface Event {
  timestamp: number;
  message: string;
}

interface LogBoxProps {
  events: Event[];
}

export default function LogBox({ events }: LogBoxProps): JSX.Element {
  return (
    <div className="bg-polarNight-0 rounded-xl px-3 py-2 flex flex-col overflow-y-auto h-1/3">
      <div className="overflow-y-scroll max-h-full scrollbar-thin">
        {events.map(({ timestamp, message }) => (
          <MarkdownText key={timestamp}>{message}</MarkdownText>
        ))}
      </div>
    </div>
  );
}
