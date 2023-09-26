import type { Story, StoryDefault } from "@ladle/react";
import ChecksumIndicator from ".";

interface StoryProps {
  actual: string;
  desired: string;
}

function StoryComponent({ actual, desired }: StoryProps) {
  return <ChecksumIndicator actual={actual} desired={desired} />;
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  actual: "123",
  desired: "abc",
};

Default.argTypes = {
  actual: {
    control: { type: "text" },
  },
  desired: {
    control: { type: "text" },
  },
};

export default {
  title: "Atoms / Checksum Indicator",
} satisfies StoryDefault;
