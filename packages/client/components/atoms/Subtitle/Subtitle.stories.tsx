import type { Story, StoryDefault } from "@ladle/react";
import Subtitle from ".";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return <Subtitle>{text}</Subtitle>;
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
  title: "Atoms / Subtitle",
} satisfies StoryDefault;
