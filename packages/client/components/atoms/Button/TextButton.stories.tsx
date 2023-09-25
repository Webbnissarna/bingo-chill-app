import type { Story, StoryDefault } from "@ladle/react";
import Button from ".";
import { RiseOutlined } from "@ant-design/icons";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="standard" onClick={() => alert("Clicked!")}>
        {text}
      </Button>
      <Button onClick={() => undefined}>
        <span className="italic">Supports</span>{" "}
        <span className="text-aurora-0">various</span>{" "}
        <span className="font-bold">Content</span>
        <RiseOutlined />
      </Button>
      <Button variant="dangerous" onClick={() => undefined}>
        Dangerous Action
      </Button>
      <Button
        variant="standard"
        disabled
        onClick={() => alert("Should never alert!")}
      >
        Disabled Button
      </Button>
    </div>
  );
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  text: "Hello World",
};

Default.argTypes = {
  text: {
    control: { type: "text" },
  },
};

export default {
  title: "Atoms / Button",
} satisfies StoryDefault;
