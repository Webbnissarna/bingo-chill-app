import type { Story, StoryDefault } from "@ladle/react";
import ConnectionControls from ".";

interface StoryProps {
  isConnected: boolean;
}

function StoryComponent({ isConnected }: StoryProps) {
  return (
    <div className="bg-polarNight-1 p-5">
      <ConnectionControls
        isConnected={isConnected}
        onConnectClicked={(uri) => alert(`Clicked! uri=${uri}`)}
      />
    </div>
  );
}

export const Default: Story<StoryProps> = StoryComponent;

Default.args = {
  isConnected: false,
};

Default.argTypes = {
  isConnected: {
    control: { type: "boolean" },
  },
};

export default {
  title: "Molecules / Connection Controls",
} satisfies StoryDefault;
