import { render } from "../../../.jest/render";
import Base64Icon from ".";

describe("Base64Icon", () => {
  it("renders", () => {
    const { asFragment } = render(<Base64Icon src="" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
