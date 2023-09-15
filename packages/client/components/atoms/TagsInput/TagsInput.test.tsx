import { render } from "../../../.jest/render";
import TagsInput from ".";

describe("TagsInput", () => {
  it("renders", () => {
    const { asFragment } = render(
      <TagsInput
        values={[]}
        options={[]}
        placeholder=""
        onChange={() => undefined}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
