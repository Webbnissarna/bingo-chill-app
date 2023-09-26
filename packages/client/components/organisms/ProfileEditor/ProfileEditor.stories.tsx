import type { StoryDefault } from "@ladle/react";
import type { Profile } from ".";
import ProfileEditor from ".";
import { useState } from "react";
import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";

export function Default() {
  const [profile, setProfile] = useState<Profile>({
    name: "Me",
    icon: SPOOKY_GHOST_IMAGE_BASE64,
    color: "#8fbcbb",
  });
  return (
    <div className="font-text text-snowStorm-0 bg-polarNight-1 p-5">
      <ProfileEditor
        profile={profile}
        onChanged={(p) => setProfile({ ...p })}
      />
      <span className="text-[8px] font-monospace block w-96 break-all">
        {JSON.stringify(profile, null, 2)}
      </span>
    </div>
  );
}

export default {
  title: "Organisms / Profile Editor",
} satisfies StoryDefault;
