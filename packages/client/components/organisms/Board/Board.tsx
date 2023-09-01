import { Tile } from "@/components/molecules";

export interface Tile {
  text: string;
  icon: string;
  colors: string[];
}

interface BoardProps {
  tiles: Tile[];
  onTileClicked: (index: number) => void;
}

export default function Board({
  tiles,
  onTileClicked,
}: BoardProps): JSX.Element {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-2 w-full max-w-3xl">
      {tiles.map((tile, index) => (
        <div key={tile.text} className="aspect-square">
          <Tile
            text={tile.text}
            highlightColors={tile.colors}
            icon={tile.icon}
            onClick={() => onTileClicked(index)}
          />
        </div>
      ))}
    </div>
  );
}
