import { render } from "../../../.jest/render";
import Toggle from ".";

describe("Toggle", () => {
  it("renders", () => {
    const { asFragment } = render(
      <Toggle checked onChange={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
