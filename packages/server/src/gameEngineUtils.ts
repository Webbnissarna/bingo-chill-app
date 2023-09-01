import type {
  Task,
  TaskFilters,
} from "@webbnissarna/bingo-chill-common/src/game/types";

function taskValidByFilters(task: Task, filter: TaskFilters): boolean {
  const included =
    filter.includedTags.length === 0 ||
    filter.includedTags.some((tag) => task.tags.includes(tag));

  const excluded =
    filter.excludedTags.length > 0 &&
    filter.excludedTags.some((tag) => task.tags.includes(tag));

  return included && !excluded;
}

export function filterTasks(tasks: Task[], filter: TaskFilters): Task[] {
  return tasks.reduce<Task[]>((acc, task) => {
    const validTask = taskValidByFilters(task, filter);
    return validTask ? [...acc, task] : acc;
  }, []);
}
