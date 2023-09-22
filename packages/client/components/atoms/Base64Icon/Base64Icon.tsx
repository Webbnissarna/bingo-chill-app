interface Base64IconProps {
  src: string;
  description?: string;
}

export default function Base64Icon({
  src,
  description,
}: Base64IconProps): JSX.Element {
  return (
    <img
      className="w-full h-full object-contain"
      src={src}
      alt={description ?? ""}
    />
  );
}
