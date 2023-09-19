import Base64Icon from "@/components/atoms/Base64Icon";
import { generateGradientCSS } from "@/utils/css";
import { useIf } from "@webbnissarna/bingo-chill-common/src/utils/functional";

interface TileProps {
  text: string;
  icon: string;
  highlightColors: string[];
  onClick: () => void;
}

export default function Tile({
  text,
  icon,
  highlightColors,
  onClick,
}: TileProps): JSX.Element {
  const hasColors = highlightColors.length > 0;
  return (
    <div
      style={useIf(hasColors, {
        background: generateGradientCSS(highlightColors),
      })}
      className="max-w-[150px] max-h-[150px] aspect-square rounded-2xl bg-polarNight-3 flex flex-col items-center py-2 gap-1 cursor-pointer hover:bg-polarNight-2 active:bg-polarNight-1 hover:opacity-90 active:opacity-80 transition select-none"
      onClick={onClick}
    >
      <div className="grow h-2/3">
        <div className="text-center w-full h-full flex flex-col justify-center">
          <span
            className={`${useIf(
              hasColors,
              "bg-polarNight-0/75",
            )} font-text text-snowStorm-2 text-xs sm:text-sm md:text-base lg:text-lg leading-snug inline-block w-full max-h-full rounded px-2 py-1`}
          >
            {text}
          </span>
        </div>
      </div>
      <div className="w-1/3 h-1/3">
        <Base64Icon src={icon} description={text} />
      </div>
    </div>
  );
}
