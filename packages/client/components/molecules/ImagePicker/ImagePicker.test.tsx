import { render } from "../../../.jest/render";
import ImagePicker from ".";

describe("ImagePicker", () => {
  it("renders", () => {
    const { asFragment } = render(<ImagePicker />);

    expect(asFragment()).toMatchSnapshot();
  });
});
