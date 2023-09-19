import type { StoryDefault } from "@ladle/react";
import TaskEditTable from ".";
import { useState } from "react";
import type { Task } from "@webbnissarna/bingo-chill-common/src/game/types";

export function Default() {
  const [tasks, setTasks] = useState<Task[]>([
    { name: "Hello World", icon: "", tags: ["A", "B", "C"] },
    { name: "Hello World 2", icon: "", tags: ["A", "B", "D", "E"] },
  ]);
  return (
    <div className="bg-polarNight-1 p-5 flex flex-col gap-3">
      <TaskEditTable tasks={tasks} onChanged={setTasks} />
      <div className="bg-polarNight-0 p-2 overflow-x-scroll">
        <pre className="font-monospace text-snowStorm-0">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default {
  title: "Organisms / Task Edit Table",
} satisfies StoryDefault;
