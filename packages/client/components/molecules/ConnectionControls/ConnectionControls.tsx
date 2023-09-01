import { TextInputField, TextButton } from "@/components/atoms";
import { useState } from "react";

interface ConnectionControlsProps {
  isConnected: boolean;
  onConnectClicked: (connectionUri: string) => void;
}

export default function ConnectionControls({
  isConnected,
  onConnectClicked,
}: ConnectionControlsProps): JSX.Element {
  const [uri, setUri] = useState("");

  return (
    <div className="flex gap-2">
      <TextInputField value={uri} onChange={setUri} />
      <TextButton
        text={isConnected ? "Disconnect" : "Connect"}
        onClick={() => onConnectClicked(uri)}
      />
    </div>
  );
}
