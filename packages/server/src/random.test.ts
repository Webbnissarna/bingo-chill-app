import { getSeededRandom, randRangeInt } from "./random";

describe("Random", () => {
  const TEST_MIN = 1;
  const TEST_MAX = 100;
  const TEST_COUNT = 100000;
  const TEST_RANGE = TEST_MAX - TEST_MIN + 1;

  it("generates within range", () => {
    const rng = getSeededRandom(1337);
    const nums = Array(TEST_COUNT)
      .fill(0)
      .map(() => randRangeInt(rng, TEST_MIN, TEST_MAX));

    const numsOutsideRange = nums.filter(
      (num) => num < TEST_MIN || num > TEST_MAX,
    );
    const allInRange = numsOutsideRange.length === 0;
    const hasMin = nums.some((num) => num === TEST_MIN);
    const hasMax = nums.some((num) => num === TEST_MAX);

    expect(allInRange).toBe(true);
    expect(hasMin).toBe(true);
    expect(hasMax).toBe(true);
  });

  it("distributes fairly equally", () => {
    const rng = getSeededRandom(1337);
    const nums = Array(TEST_COUNT)
      .fill(0)
      .map(() => randRangeInt(rng, TEST_MIN, TEST_MAX));

    const percentages = nums
      .reduce<number[]>((acc, num) => {
        acc[num] = (acc[num] ?? 0) + 1;
        return [...acc];
      }, [])
      .filter((c) => !isNaN(c))
      .map((count) => (count / TEST_COUNT) * 100);

    const expectedAveragePercentage = 100 / TEST_RANGE;
    const plausibleVariance = expectedAveragePercentage * 0.2;

    console.log(
      `expected average: ${expectedAveragePercentage}% (+- ${plausibleVariance}%)`,
    );
    console.log("percentages head:", percentages.slice(0, 10));
    console.log("percentages tail:", percentages.slice(-10));

    const allFairlyEqual = percentages
      .map(
        (percentage) =>
          percentage >= expectedAveragePercentage - plausibleVariance &&
          percentage <= expectedAveragePercentage + plausibleVariance,
      )
      .reduce<boolean>((final, isEqual) => final && isEqual, true);

    expect(percentages).toHaveLength(TEST_RANGE);
    expect(allFairlyEqual).toBe(true);
  });
});
