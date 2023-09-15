import IntegerInputField from "@/components/atoms/IntegerInputField/IntegerInputField";
import Text from "@/components/atoms/Text";
import TextButton from "@/components/atoms/TextButton";
import TextInputField from "@/components/atoms/TextInputField";
import Toggle from "@/components/atoms/Toggle";
import { ServiceRegistryContext } from "@/services/ServiceRegistry/ServiceRegistryContext";
import merge from "lodash.merge";
import { useCallback, useContext } from "react";

export interface GameControlOptions {
  seed: number;
  isLockout: boolean;
  timeLimitMinutes: number;
}

interface GameControlsProps {
  options: GameControlOptions;
  onChange: (newOptions: GameControlOptions) => void;
  onLoadGameSetup: () => void;
  onStartGame: () => void;
}

export default function GameControls({
  options,
  onChange,
  onLoadGameSetup,
  onStartGame,
}: GameControlsProps): JSX.Element {
  const serviceRegistry = useContext(ServiceRegistryContext);

  const updateOptions = useCallback(
    (update: Partial<GameControlOptions>) => {
      onChange({ ...merge(options, update) });
    },
    [options, onChange],
  );

  const randomizeSeed = () => {
    const rng = serviceRegistry.get("Randomness");
    const seed = rng.randRangeInt(0, 10000000);
    updateOptions({ seed });
  };

  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <TextButton text="Load Game Setup" onClick={onLoadGameSetup} />
      <div className="grid grid-cols-[auto_auto] gap-2 w-full">
        <Text>Seed</Text>
        <div className="flex gap-2">
          <IntegerInputField
            value={options.seed}
            onChange={(seed) => updateOptions({ seed })}
          />
          <TextButton text="R" onClick={randomizeSeed} />
        </div>

        <Text>Tag Filter</Text>
        <TextInputField value="" onChange={() => undefined} />

        <Text>Lockout?</Text>
        <Toggle
          checked={options.isLockout}
          onChange={(isLockout) => updateOptions({ isLockout })}
        />

        <Text>Time Limit</Text>
        <IntegerInputField
          value={options.timeLimitMinutes}
          onChange={(timeLimitMinutes) => updateOptions({ timeLimitMinutes })}
        />
      </div>
      <TextButton text="Start Game" onClick={onStartGame} />
    </div>
  );
}
