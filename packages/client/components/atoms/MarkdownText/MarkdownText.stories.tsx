import type { Story, StoryDefault } from "@ladle/react";
import MarkdownText from ".";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return <MarkdownText>{text}</MarkdownText>;
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  text: '(13:37) <span style="color:#ebcb8b">Horse</span> completed **Obtain Leek**',
};

Default.argTypes = {
  text: {
    control: { type: "text" },
  },
};

export default {
  title: "Atoms / Markdown Text",
} satisfies StoryDefault;
