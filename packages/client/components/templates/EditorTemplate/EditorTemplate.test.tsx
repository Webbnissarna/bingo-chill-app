import { render } from "../../../.jest/render";
import EditorTemplate from ".";

describe("EditorTemplate", () => {
  it("renders", () => {
    const { asFragment } = render(<EditorTemplate />);

    expect(asFragment()).toMatchSnapshot();
  });
});
