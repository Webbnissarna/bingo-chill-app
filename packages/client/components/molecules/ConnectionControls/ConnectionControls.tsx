import { TextInputField, Button } from "@/components/atoms";
import { useState } from "react";

interface ConnectionControlsProps {
  state: "connected" | "disconnected" | "connecting";
  onConnectClicked: (connectionUri: string) => void;
}

export default function ConnectionControls({
  state,
  onConnectClicked,
}: ConnectionControlsProps): JSX.Element {
  const [uri, setUri] = useState("");

  return (
    <div className="flex items-center gap-2">
      <TextInputField value={uri} onChange={setUri} />
      <span className="text-aurora-3">
        {state === "connected" ? "Connected!" : ""}
      </span>
      <Button
        disabled={state === "connecting"}
        onClick={() => onConnectClicked(uri)}
        variant={state === "connected" ? "dangerous" : "standard"}
      >
        {state === "connected"
          ? "Disconnect"
          : state === "disconnected"
          ? "Connect"
          : state === "connecting"
          ? "Connecting..."
          : state}
      </Button>
    </div>
  );
}
