import type { StoryDefault } from "@ladle/react";
import TaskEditTable from ".";

export function Default() {
  return (
    <div className="bg-polarNight-1 p-5">
      <TaskEditTable tasks={[]} onTasksChanged={() => undefined} />
    </div>
  );
}

export default {
  title: "Molecules / Task Edit Table",
} satisfies StoryDefault;
