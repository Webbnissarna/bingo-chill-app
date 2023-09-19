import { render } from "../../../.jest/render";
import GameControls from ".";

describe("GameControls", () => {
  it("renders", () => {
    const noop = () => undefined;
    const { asFragment } = render(
      <GameControls
        options={{ seed: 0, isLockout: false, timeLimitMinutes: 0 }}
        onChange={noop}
        onLoadGameSetup={noop}
        onStartGame={noop}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
