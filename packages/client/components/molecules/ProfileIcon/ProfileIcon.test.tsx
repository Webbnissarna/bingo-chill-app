import { render } from "../../../.jest/render";
import ProfileIcon from ".";

describe("ProfileIcon", () => {
  it("renders", () => {
    const { asFragment } = render(
      <ProfileIcon badgeValue={0} icon="" trimColor="" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
