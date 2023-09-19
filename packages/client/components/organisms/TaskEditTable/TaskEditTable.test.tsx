import { render } from "../../../.jest/render";
import TaskEditTable from ".";

describe("TaskEditTable", () => {
  it("renders", () => {
    const { asFragment } = render(
      <TaskEditTable tasks={[]} onChanged={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
