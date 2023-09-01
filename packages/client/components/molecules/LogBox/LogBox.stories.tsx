import dayjs from "dayjs";
import LogBox from ".";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  return (
    <div className="bg-polarNight-1 p-5 max-h-40 flex flex-col">
      <LogBox
        events={[
          {
            timestamp: dayjs(0).unix(),
            message: `(03:05) <span style="color:#ebcb8b">Horse</span> completed **Obtain Leek**`,
          },
          {
            timestamp: dayjs(1).unix(),
            message: `(03:52) <span style="color:#5e81ac">Cat</span> completed **Give a Loved Gift**`,
          },
          {
            timestamp: dayjs(2).unix(),
            message: `(03:55) <span style="color:#8fbcbb">Panda</span> disconnected`,
          },
          {
            timestamp: dayjs(3).unix(),
            message: `(04:15) <span style="color:#b48ead">Dog</span> joined`,
          },
          {
            timestamp: dayjs(4).unix(),
            message: `(04:33) <span style="color:#b48ead">Dog</span> completed **Obtain Sprinkler**`,
          },
          {
            timestamp: dayjs(5).unix(),
            message: `(05:00) <span style="color:#ebcb8b">Horse</span> completed **Kill a Grub**`,
          },
          {
            timestamp: dayjs(6).unix(),
            message: `(05:15) <span style="color:#5e81ac">Cat</span> completed **Kill a Grub**`,
          },
          {
            timestamp: dayjs(7).unix(),
            message: `(06:30) <span style="color:#5e81ac">Cat</span> started a new game (seed=*1234567890*, tags=<span style="color:#bf616a">short</span>,<span style="color:#d08770">crafting</span>,<span style="color:#b48ead">combat</span> lockout=<span style="color:#a3be8c">✔</span> time=**1h**)`,
          },
        ]}
      />
    </div>
  );
}

export default {
  title: "Molecules / Log Box",
} satisfies StoryDefault;
