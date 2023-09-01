import { render } from "../../../.jest/render";
import IntegerInputField from ".";

describe("IntegerInputField", () => {
  it("renders", () => {
    const { asFragment } = render(
      <IntegerInputField value={0} onChange={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
