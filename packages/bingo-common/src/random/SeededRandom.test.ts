import SeededRandom from "./SeededRandom";

function getPercentages(list: number[], totalCount: number): number[] {
  return list
    .reduce<number[]>((acc, num) => {
      acc[num] = (acc[num] ?? 0) + 1;
      return [...acc];
    }, [])
    .filter((c) => !isNaN(c))
    .map((c) => (c / totalCount) * 100);
}

function arePercentagesFairlyEqual(percentages: number[]): boolean {
  const expectedAveragePercentage = 100 / percentages.length;
  const plausibleVariance = expectedAveragePercentage * 0.2;

  /* console.log(
    `expected average: ${expectedAveragePercentage}% (+- ${plausibleVariance}%)`,
  );
  console.log("percentages head:", percentages.slice(0, 10));
  console.log("percentages tail:", percentages.slice(-10)); */

  return percentages
    .map(
      (percentage) =>
        percentage >= expectedAveragePercentage - plausibleVariance &&
        percentage <= expectedAveragePercentage + plausibleVariance,
    )
    .reduce<boolean>((final, isEqual) => final && isEqual, true);
}

describe("seedrandomRandomnessService", () => {
  const TEST_MIN = 1;
  const TEST_MAX = 100;
  const TEST_COUNT = 100000;
  const TEST_RANGE = TEST_MAX - TEST_MIN + 1;

  it("generates within range", () => {
    const rng = new SeededRandom();
    rng.setSeed(1337);
    const nums = Array(TEST_COUNT)
      .fill(0)
      .map(() => rng.randRangeInt(TEST_MIN, TEST_MAX));

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
    const rng = new SeededRandom();
    rng.setSeed(1337);
    const nums = Array(TEST_COUNT)
      .fill(0)
      .map(() => rng.randRangeInt(TEST_MIN, TEST_MAX));

    const percentages = getPercentages(nums, TEST_COUNT);
    const allFairlyEqual = arePercentagesFairlyEqual(percentages);

    expect(percentages).toHaveLength(TEST_RANGE);
    expect(allFairlyEqual).toBe(true);
  });

  it("randomizes unique lists", () => {
    const rng = new SeededRandom();
    rng.setSeed(1337);

    const count = 10;
    const min = 15;
    const max = 45;

    const result = Array(TEST_COUNT)
      .fill(0)
      .map(() => rng.randUniqueValues(count, min, max));

    const arraysWithWrongCount = result.filter((arr) => arr.length !== count);

    const arraysOutsideRange = result.filter((arr) =>
      arr.some((v) => v < min || v > max),
    );

    const arraysWithDuplicates = result.filter(
      (arr) => new Set([...arr]).size !== count,
    );

    const allValues = result.flat();

    const percentages = getPercentages(allValues, TEST_COUNT * count);
    const allFairlyEqual = arePercentagesFairlyEqual(percentages);

    const possibleValues = Array(max - min + 1)
      .fill(0)
      .map((_, i) => min + i);
    const resultValues = allValues.reduce<number[]>(
      (acc, v) => (acc.includes(v) ? acc : [...acc, v]),
      [],
    );
    const possibleValuesNotChosen = possibleValues.filter(
      (v) => !resultValues.includes(v),
    );

    const allResultsAreSame = result
      .slice(1)
      .reduce<boolean>(
        (same, arr, i) => same && arr.every((v, ia) => result[i][ia] === v),
        true,
      );

    expect(arraysWithWrongCount).toHaveLength(0);
    expect(arraysOutsideRange).toHaveLength(0);
    expect(arraysWithDuplicates).toHaveLength(0);
    expect(allFairlyEqual).toBe(true);
    expect(possibleValuesNotChosen).toHaveLength(0);
    expect(allResultsAreSame).toBe(false);
  });
});
