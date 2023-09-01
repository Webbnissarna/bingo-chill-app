import { render } from "../../../.jest/render";
import Tile from ".";

describe("Tile", () => {
  it("renders", () => {
    const { asFragment } = render(
      <Tile text="" icon="" highlightColors={[]} onClick={() => undefined} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
