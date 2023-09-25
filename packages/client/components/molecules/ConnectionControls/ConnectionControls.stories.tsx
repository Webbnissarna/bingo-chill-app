import type { Story, StoryDefault } from "@ladle/react";
import ConnectionControls from ".";

interface StoryProps {
  state: "connected" | "disconnected" | "connecting";
}

function StoryComponent({ state }: StoryProps) {
  return (
    <div className="bg-polarNight-1 p-5">
      <ConnectionControls
        state={state}
        onConnectClicked={(uri) => alert(`Clicked! uri=${uri}`)}
      />
    </div>
  );
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  state: "disconnected",
};

Default.argTypes = {
  state: {
    control: {
      type: "select",
    },
    options: ["connected", "connecting", "disconnected"],
  },
};

export default {
  title: "Molecules / Connection Controls",
} satisfies StoryDefault;
