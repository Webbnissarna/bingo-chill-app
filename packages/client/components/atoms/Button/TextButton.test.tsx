import { render } from "../../../.jest/render";
import Button from ".";

describe("Button", () => {
  it("renders", () => {
    const { asFragment } = render(
      <Button text="Hello World" onClick={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
