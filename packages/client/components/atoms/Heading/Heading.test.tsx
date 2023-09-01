import { render } from "../../../.jest/render";
import Heading from ".";

describe("Heading", () => {
  it("renders", () => {
    const { asFragment } = render(<Heading>Hello World</Heading>);

    expect(asFragment()).toMatchSnapshot();
  });
});
