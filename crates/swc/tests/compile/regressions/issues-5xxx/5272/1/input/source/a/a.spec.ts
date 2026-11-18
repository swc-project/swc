import { Foo } from "./a";

describe("a", () => {
    it("does its thing", () => {
        const a = new Foo();
        expect(a.bar()).toBe(3);
        expect(a.foo()).toBe(2);
    });
});