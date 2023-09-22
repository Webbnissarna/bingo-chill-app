import { render } from "../../../.jest/render";
import GameControls from ".";

describe("GameControls", () => {
  it("renders", () => {
    const noop = () => undefined;
    const { asFragment } = render(
      <GameControls
        options={{
          seed: 1337,
          isLockout: false,
          taskFilters: {
            includedTags: [],
            excludedTags: [],
          },
          timeLimitMinutes: 0,
        }}
        allTags={[]}
        onChange={noop}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
