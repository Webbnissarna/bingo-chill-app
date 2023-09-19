import React from "react";

interface ButtonProps {
  variant?: "standard" | "dangerous";
  children: React.ReactNode;
  onClick: () => void;
}

export default function Button({
  variant,
  children,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`font-text font-base text-snowStorm-2 px-3 py-1 rounded-lg transition flex gap-1 items-center justify-center ${
        variant === "dangerous"
          ? "bg-aurora-0 hover:bg-aurora-1 active:bg-aurora-2"
          : "bg-polarNight-3 hover:bg-frost-3 active:bg-frost-2"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
