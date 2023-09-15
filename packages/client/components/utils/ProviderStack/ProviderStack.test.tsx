import { render } from "../../../.jest/render";
import ProviderStack from ".";

describe("ProviderStack", () => {
  it("renders", () => {
    const { asFragment } = render(<ProviderStack>{}</ProviderStack>);

    expect(asFragment()).toMatchSnapshot();
  });
});
