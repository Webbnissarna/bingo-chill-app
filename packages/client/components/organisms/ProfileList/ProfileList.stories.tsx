import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";
import ProfileList from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  return (
    <div className="bg-polarNight-1 p-5">
      <ProfileList
        profiles={[
          {
            id: "a",
            icon: SPOOKY_GHOST_IMAGE_BASE64,
            badgeValue: 0,
            trimColor: "#bf616a",
          },
          {
            id: "b",
            icon: SPOOKY_GHOST_IMAGE_BASE64,
            badgeValue: 1,
            trimColor: "#a3be8c",
          },
          {
            id: "c",
            icon: SPOOKY_GHOST_IMAGE_BASE64,
            badgeValue: 2,
            trimColor: "#b48ead",
          },
          {
            id: "d",
            icon: SPOOKY_GHOST_IMAGE_BASE64,
            badgeValue: 3,
            trimColor: "#ebcb8b",
          },
          {
            id: "e",
            icon: SPOOKY_GHOST_IMAGE_BASE64,
            badgeValue: 4,
            trimColor: "#d08770",
          },
        ]}
      />
    </div>
  );
}

export default {
  title: "Organisms / Profile List",
} satisfies StoryDefault;
