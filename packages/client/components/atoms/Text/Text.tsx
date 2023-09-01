interface TextProps {
  children: string | number;
}

export default function Text({ children }: TextProps): JSX.Element {
  return (
    <span className="font-text text-snowStorm-2 text-base">{children}</span>
  );
}
