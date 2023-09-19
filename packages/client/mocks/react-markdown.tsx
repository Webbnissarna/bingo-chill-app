import React from "react";

export interface ReactMarkdownProps {
  children: React.ReactNode;
}

export default function ReactMarkdown({
  children,
}: ReactMarkdownProps): JSX.Element {
  return <>{children}</>;
}
