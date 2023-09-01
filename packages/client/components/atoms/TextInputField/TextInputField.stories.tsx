import { useState } from "react";
import TextInputField from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  const [value, setValue] = useState("Hello World");
  return (
    <div className="bg-polarNight-1 p-5">
      <TextInputField value={value} onChange={setValue} />
    </div>
  );
}

export default {
  title: "Atoms / Text Input Field",
} satisfies StoryDefault;
