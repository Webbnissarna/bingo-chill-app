import type { StoryDefault } from "@ladle/react";
import Base64Icon from ".";
import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";

export function Default() {
  return (
    <Base64Icon description="Spooky ghost" src={SPOOKY_GHOST_IMAGE_BASE64} />
  );
}

export default {
  title: "Atoms / Base64 Icon",
} satisfies StoryDefault;
