"use client";

import { useState } from "react";

interface TextInputFieldProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function TextInputField({
  value,
  onChange,
}: TextInputFieldProps): JSX.Element {
  const [editingTemp, setEditingTemp] = useState<string>(value);
  const [isEditing, setIsEditing] = useState(false);

  const endEditing = () => {
    setIsEditing(false);
    onChange(editingTemp);
  };

  return (
    <input
      className="w-full font-text text-base text-snowStorm-2 outline-none border-none shadow-none bg-polarNight-0 rounded px-2 py-1 focus:bg-polarNight-2 transition"
      type="text"
      value={isEditing ? editingTemp : value}
      onFocus={() => setIsEditing(true)}
      onBlur={endEditing}
      onSubmit={endEditing}
      onChange={(e) => setEditingTemp(e.currentTarget.value)}
    />
  );
}
