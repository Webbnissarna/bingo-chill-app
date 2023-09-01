import { useState } from "react";
import Toggle from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  const [value, setValue] = useState(false);
  return (
    <div className="bg-polarNight-1 p-5">
      <Toggle checked={value} onChange={setValue} />
    </div>
  );
}

export default {
  title: "Atoms / Toggle",
} satisfies StoryDefault;
