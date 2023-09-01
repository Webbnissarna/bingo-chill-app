interface HeadingProps {
  children: string;
}

export default function Heading({ children }: HeadingProps): JSX.Element {
  return <h1 className="font-heading text-snowStorm-2 text-5xl">{children}</h1>;
}
