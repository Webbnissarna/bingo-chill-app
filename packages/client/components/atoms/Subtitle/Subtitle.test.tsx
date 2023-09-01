import { render } from "../../../.jest/render";
import Subtitle from ".";

describe("Subtitle", () => {
  it("renders", () => {
    const { asFragment } = render(<Subtitle>Hello World</Subtitle>);

    expect(asFragment()).toMatchSnapshot();
  });
});
