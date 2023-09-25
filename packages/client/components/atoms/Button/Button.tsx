import React from "react";

interface ButtonProps {
  variant?: "standard" | "dangerous";
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export default function Button({
  variant,
  disabled,
  children,
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={`font-text font-base text-snowStorm-2 px-3 py-1 rounded-lg transition flex gap-1 items-center justify-center ${
        disabled === true
          ? "bg-polarNight-1 text-polarNight-3"
          : variant === "dangerous"
          ? "bg-aurora-0 hover:bg-aurora-1 active:bg-aurora-2"
          : "bg-polarNight-3 hover:bg-frost-3 active:bg-frost-2"
      }`}
      onClick={disabled === true ? () => undefined : onClick}
    >
      {children}
    </button>
  );
}
