import { render } from "../../../.jest/render";
import TextButton from ".";

describe("TextButton", () => {
  it("renders", () => {
    const { asFragment } = render(
      <TextButton text="Hello World" onClick={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
