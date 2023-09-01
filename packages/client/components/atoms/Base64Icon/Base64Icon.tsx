interface Base64IconProps {
  src: string;
  description?: string;
}

export default function Base64Icon({
  src,
  description,
}: Base64IconProps): JSX.Element {
  return <img src={`data:image/png;base64,${src}`} alt={description ?? ""} />;
}
