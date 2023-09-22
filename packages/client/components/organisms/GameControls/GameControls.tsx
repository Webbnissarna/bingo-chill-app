import IntegerInputField from "@/components/atoms/IntegerInputField/IntegerInputField";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Toggle from "@/components/atoms/Toggle";
import { ServiceRegistryContext } from "@/services/ServiceRegistry/ServiceRegistryContext";
import { useContext } from "react";
import type { SessionOptions } from "@webbnissarna/bingo-chill-common/src/game/types";
import type { DeepPartial } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { TagsInput } from "@/components/atoms";
import type { Tag } from "@/components/atoms/TagsInput";

interface GameControlsProps {
  options: SessionOptions;
  allTags: Tag[];
  onChange: (newOptions: SessionOptions) => void;
}

export default function GameControls({
  options,
  allTags,
  onChange,
}: GameControlsProps): JSX.Element {
  const serviceRegistry = useContext(ServiceRegistryContext);

  const updateOptions = (update: DeepPartial<SessionOptions>) => {
    onChange(patch(options, update));
  };

  const randomizeSeed = () => {
    const rng = serviceRegistry.get("Randomness");
    const seed = rng.randRangeInt(0, 10000000);
    updateOptions({ seed });
  };

  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <div className="grid grid-cols-[auto_auto] gap-2 w-full">
        <Text>Seed</Text>
        <div className="flex gap-2">
          <IntegerInputField
            value={options.seed}
            onChange={(seed) => updateOptions({ seed })}
          />
          <Button onClick={randomizeSeed}>R</Button>
        </div>

        <Text>Include Tasks</Text>
        <TagsInput
          placeholder="Tags"
          values={options.taskFilters.includedTags}
          options={allTags}
          onChange={(includedTags) =>
            updateOptions({ taskFilters: { includedTags } })
          }
        />
        <Text>Exclude Tasks</Text>
        <TagsInput
          placeholder="Tags"
          values={options.taskFilters.excludedTags}
          options={allTags}
          onChange={(excludedTags) =>
            updateOptions({ taskFilters: { excludedTags } })
          }
        />

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
    </div>
  );
}
