import foo from "./foo";

jest.mock("./foo").mock("./bar");

test("Foo is a mock", () => {
    expect(jest.isMockFunction(foo)).toBe(true);
});
