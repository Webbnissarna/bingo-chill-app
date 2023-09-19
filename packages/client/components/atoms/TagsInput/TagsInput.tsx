import { Select } from "antd";

export interface Tag {
  label: string;
  value: string;
}

export interface TagsInputProps {
  values: string[];
  options: Tag[];
  placeholder: string;
  onChange: (values: string[]) => void;
}

export default function TagsInput({
  options,
  placeholder,
  onChange,
  values,
}: TagsInputProps): JSX.Element {
  return (
    <Select
      allowClear
      mode="tags"
      options={options}
      placeholder={placeholder}
      className="w-full"
      value={values}
      onChange={onChange}
    />
  );
}
