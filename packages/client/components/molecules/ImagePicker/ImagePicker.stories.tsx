import type { StoryDefault } from "@ladle/react";
import ImagePicker from ".";
import { useState } from "react";

export function Default() {
  const [base64, setBase64] = useState<string | null>(null);

  return (
    <div className="font-text text-snowStorm-0 bg-polarNight-1 p-5">
      <ImagePicker value={base64} onChange={setBase64} />
      <span className="text-[8px] font-monospace block w-96 break-all">
        {base64 ?? "<null>"}
      </span>
    </div>
  );
}

export default {
  title: "Molecules / Image Picker",
} satisfies StoryDefault;
