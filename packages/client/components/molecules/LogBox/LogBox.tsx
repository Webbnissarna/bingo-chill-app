import MarkdownText from "@/components/atoms/MarkdownText/MarkdownText";
import { useEffect, useRef } from "react";

export interface Event {
  timestamp: number;
  message: string;
}

interface LogBoxProps {
  events: Event[];
}

export default function LogBox({ events }: LogBoxProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  };

  useEffect(scrollToBottom, [events]);

  return (
    <div className="bg-polarNight-0 h-full rounded-xl px-3 py-2 flex flex-col overflow-y-auto">
      <div ref={ref} className="overflow-y-scroll scrollbar-thin relative">
        {events.map(({ timestamp, message }, i) => (
          <MarkdownText key={i}>{`${timestamp} ${message}`}</MarkdownText>
        ))}
      </div>
    </div>
  );
}
