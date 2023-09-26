import { render } from "../../../.jest/render";
import ProfileEditor from ".";

describe("ProfileEditor", () => {
  it("renders", () => {
    const { asFragment } = render(
      <ProfileEditor
        profile={{ name: "", color: "", icon: "" }}
        onChanged={() => undefined}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
