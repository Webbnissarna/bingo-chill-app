import { render } from "../../../.jest/render";
import ProfileList from ".";

describe("ProfileList", () => {
  it("renders", () => {
    const { asFragment } = render(<ProfileList profiles={[]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
