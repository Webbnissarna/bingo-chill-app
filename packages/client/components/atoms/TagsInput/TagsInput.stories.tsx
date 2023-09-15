import type { StoryDefault } from "@ladle/react";
import TagsInput from ".";
import { useState } from "react";

export function Default() {
  const [values, setValues] = useState(["a", "b"]);
  return (
    <div className="bg-polarNight-1 p-5">
      <TagsInput
        placeholder="enter tags"
        values={values}
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
          { label: "C", value: "c" },
          { label: "D", value: "d" },
        ]}
        onChange={(v) => setValues(v)}
      />
    </div>
  );
}

export default {
  title: "Atoms / Tags Input",
} satisfies StoryDefault;
