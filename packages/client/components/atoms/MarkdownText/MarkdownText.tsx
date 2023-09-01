import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownTextProps {
  children: string;
}

export default function MarkdownText({
  children,
}: MarkdownTextProps): JSX.Element {
  return (
    <div className="font-text text-snowStorm-2">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{children}</ReactMarkdown>
    </div>
  );
}
