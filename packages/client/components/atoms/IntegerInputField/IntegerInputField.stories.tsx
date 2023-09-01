import { useState } from "react";
import IntegerInputField from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  const [value, setValue] = useState(1337);
  return (
    <div className="bg-polarNight-1 p-5">
      <IntegerInputField value={value} onChange={setValue} />
    </div>
  );
}

export default {
  title: "Atoms / Integer Input Field",
} satisfies StoryDefault;
