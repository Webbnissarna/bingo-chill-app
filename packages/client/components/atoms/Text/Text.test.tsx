import { render } from "../../../.jest/render";
import Text from ".";

describe("Text", () => {
  it("renders", () => {
    const { asFragment } = render(
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
        voluptatibus officia voluptate dolores esse maiores omnis veniam harum
        pariatur animi vitae, numquam, nesciunt, velit sed blanditiis
        cupiditate? Cum, quaerat commodi.
      </Text>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
