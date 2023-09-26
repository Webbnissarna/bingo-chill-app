import { render } from "../../../.jest/render";
import ChecksumIndicator from ".";

describe("ChecksumIndicator", () => {
  it("renders", () => {
    const { asFragment } = render(<ChecksumIndicator actual="" desired="" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
