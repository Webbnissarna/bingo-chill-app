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
    <div className="bg-polarNight-0 h-full rounded-xl px-3 py-2 flex flex-col overflow-y-auto">
      <div className="overflow-y-scroll scrollbar-thin">
        {events.map(({ timestamp, message }) => (
          <MarkdownText key={timestamp}>{message}</MarkdownText>
        ))}
      </div>
    </div>
  );
}
