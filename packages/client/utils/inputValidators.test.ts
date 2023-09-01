import { runCallbackIfInteger } from "./inputValidators";

describe("Input Validators", () => {
  it.each([
    "",
    "asdf",
    "012345",
    "1.1",
    "13,37",
    "i",
    " ",
    "8i8i8i8",
    "0xDEADBEEF",
    "0b10",
    "0.123e4",
    "-",
    "-0",
    "-1",
    "-123",
    "-123.456",
  ])("runCallbackIfInteger not to call for '%s'", (rawString) => {
    const fn = jest.fn();

    runCallbackIfInteger(rawString, fn);

    expect(fn).not.toHaveBeenCalled();
  });

  it.each([
    ["0", 0],
    ["1", 1],
    ["12345", 12345],
    ["1238712983712980", 1238712983712980],
  ])("runCallbackIfInteger '%s' => '%s'", (rawString, expectedValue) => {
    const fn = jest.fn();

    runCallbackIfInteger(rawString, fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(expectedValue);
  });
});
