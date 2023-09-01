import type { Story, StoryDefault } from "@ladle/react";
import Text from ".";

interface StoryProps {
  text: string;
}

function StoryComponent({ text }: StoryProps) {
  return <Text>{text}</Text>;
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  text:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis repellat id" +
    "sed esse, numquam itaque ex aperiam provident quaerat deserunt sunt, harum" +
    "temporibus non. Quae ipsum quas nobis illum rerum.",
};

Default.argTypes = {
  text: {
    control: { type: "text" },
  },
};

export default {
  title: "Atoms / Text",
} satisfies StoryDefault;
