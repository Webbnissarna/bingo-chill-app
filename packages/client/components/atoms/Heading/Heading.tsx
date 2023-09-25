"use client";

import figlet from "figlet";
import blocks from "figlet/importable-fonts/Blocks";
import { useEffect, useState } from "react";

interface HeadingProps {
  children: string;
}

export default function Heading({ children }: HeadingProps): JSX.Element {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    figlet.parseFont("Blocks", blocks);
    figlet.text(
      children,
      {
        font: "Blocks",
        horizontalLayout: "controlled smushing",
        verticalLayout: "controlled smushing",
      },
      (_, result) => {
        setText(result ?? "");
      },
    );
  });

  return (
    <div className="flex flex-col text-snowStorm-0 text-[6px] font-monospace">
      {text.split("\n").map((t) => (
        <pre key={t}>{t}</pre>
      ))}
    </div>
  );
}
