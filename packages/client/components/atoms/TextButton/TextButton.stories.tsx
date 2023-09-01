import type { Story, StoryDefault } from "@ladle/react";
import TextButton from ".";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return <TextButton text={text} onClick={() => alert("Clicked!")} />;
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
  title: "Atoms / Text Button",
} satisfies StoryDefault;
