interface Base64IconProps {
  src: string;
  description?: string;
}

export default function Base64Icon({
  src,
  description,
}: Base64IconProps): JSX.Element {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-full h-full object-contain"
      src={src}
      alt={description ?? ""}
    />
  );
}
