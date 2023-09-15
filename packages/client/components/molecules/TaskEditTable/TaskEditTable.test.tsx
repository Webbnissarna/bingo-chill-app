import { render } from "../../../.jest/render";
import TaskEditTable from ".";

describe("TaskEditTable", () => {
  it("renders", () => {
    const { asFragment } = render(
      <TaskEditTable tasks={[]} onTasksChanged={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
