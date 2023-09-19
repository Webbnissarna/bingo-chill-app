import { TextInputField, Button } from "@/components/atoms";
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
      <Button onClick={() => onConnectClicked(uri)}>
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}
