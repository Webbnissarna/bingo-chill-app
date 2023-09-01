import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";
import Board from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  return (
    <Board
      tiles={[
        /* prettier-ignore */ { text: "Shadowbane Dagger",           icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Phoenix Feather Amulet",      icon: SPOOKY_GHOST_IMAGE_BASE64, colors: ["#a3b38c"] },
        /* prettier-ignore */ { text: "Gilded Elixir Flask",         icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Astral Starstone",            icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Celestial Rune Gauntlets",    icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Frostfire Potion",            icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Enigmatic Puzzle Box",        icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Crystaline Shardblade",       icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Wyvern Scale Armor",          icon: SPOOKY_GHOST_IMAGE_BASE64, colors: ["#81a1c1"] },
        /* prettier-ignore */ { text: "Arcane Chronometer",          icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Echoing Whispers Scroll",     icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Lunar Crescent Bow",          icon: SPOOKY_GHOST_IMAGE_BASE64, colors: ["#ebcb8b"] },
        /* prettier-ignore */ { text: "Thunderstrike Warhammer",     icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Mysterious Vial of Dreams",   icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Solarium Crown",              icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Thieves' Gambit Dice Set",    icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Bloodmoon Pendant",           icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Stormwrought Quill",          icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Ironheart Shield",            icon: SPOOKY_GHOST_IMAGE_BASE64, colors: ["#a3be8c", "#81a1c1"] },
        /* prettier-ignore */ { text: "Serpent's Embrace Ring",      icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Verdant Whisper Cloak",       icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Crystal Lotus Petal",         icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Runebound Compass",           icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Venomspike Crossbow",         icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
        /* prettier-ignore */ { text: "Timeless Hourglass",          icon: SPOOKY_GHOST_IMAGE_BASE64, colors: [] },
      ]}
      onTileClicked={(index) => alert(`Clicked tile #${index}`)}
    />
  );
}

export default {
  title: "Organisms / Board",
} satisfies StoryDefault;
