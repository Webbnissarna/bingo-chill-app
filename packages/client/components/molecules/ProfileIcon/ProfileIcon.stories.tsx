import type { Story, StoryDefault } from "@ladle/react";
import ProfileIcon from ".";
import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";

interface StoryProps {
  name: string;
  badgeValue: number;
  trimColor: string;
}

function StoryComponent({ name, badgeValue, trimColor }: StoryProps) {
  return (
    <div className="bg-polarNight-1 p-5">
      <ProfileIcon
        name={name}
        icon={SPOOKY_GHOST_IMAGE_BASE64}
        badgeValue={badgeValue}
        trimColor={trimColor}
      />
    </div>
  );
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  name: "Player",
  badgeValue: 5,
  trimColor: "#bf616a",
};

Default.argTypes = {
  name: {
    control: { type: "text" },
  },
  badgeValue: {
    control: { type: "number" },
  },
  trimColor: {
    control: { type: "radio" },
    options: ["#bf616a", "#d08770", "#ebcb8b", "#a3be8c", "#b48ead"],
  },
};

export default {
  title: "Molecules / Profile Icon",
} satisfies StoryDefault;
