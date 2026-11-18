import { sum } from "./";

describe("example test that should fail due to compilation", () => {
    test.each([
        ["a", 1, 1, 2],
        ["b", 2, 2, 4],
    ])("for entry %s", (_, a, b, expected) => {
        const result = sum(a, b);
        expect(result).toEqual(expected);
    });
});
