import type { Story, StoryDefault } from "@ladle/react";
import Heading from ".";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return <Heading>{text}</Heading>;
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
  title: "Atoms / Heading",
} satisfies StoryDefault;
