import type { Story, StoryDefault } from "@ladle/react";
import Tile from ".";
import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";

interface StoryProps {
  text: string;
  colors: string[];
}

function StoryComponent({ text, colors }: StoryProps) {
  return (
    <Tile
      text={text}
      icon={SPOOKY_GHOST_IMAGE_BASE64}
      highlightColors={colors ?? []}
      onClick={() => undefined}
    />
  );
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  text: "Hello World",
  colors: [],
};

Default.argTypes = {
  text: {
    control: { type: "text" },
  },
  colors: {
    options: ["#bf616a", "#d08770", "#ebcb8b", "#a3be8c", "#b48ead"],
    control: { type: "check" },
  },
};

export default {
  title: "Molecules / Tile",
} satisfies StoryDefault;
