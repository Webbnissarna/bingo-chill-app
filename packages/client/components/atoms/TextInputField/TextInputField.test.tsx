import { render } from "../../../.jest/render";
import TextInputField from ".";

describe("TextInputField", () => {
  it("renders", () => {
    const { asFragment } = render(
      <TextInputField value="Hello World" onChange={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
