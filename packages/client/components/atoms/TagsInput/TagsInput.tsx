import { Select } from "antd";

export interface TagsInputProps {
  values: string[];
  options: { label: string; value: string }[];
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
      mode="multiple"
      options={options}
      placeholder={placeholder}
      className="w-full"
      value={values}
      onChange={onChange}
    />
  );
}
