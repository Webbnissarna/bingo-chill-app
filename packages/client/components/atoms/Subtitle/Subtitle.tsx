interface SubtitleProps {
  children: string;
}

export default function Subtitle({ children }: SubtitleProps): JSX.Element {
  return <h1 className="font-heading text-snowStorm-2 text-3xl">{children}</h1>;
}
