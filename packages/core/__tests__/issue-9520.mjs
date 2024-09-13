import swc from "..";

it("should transform synchronously", () => {
    const { code } = swc.transformSync(`export function foo() {
	if (false) {
	}
	return 'foo';
};`);

    expect(code).toMatchInlineSnapshot(`
        "export function foo() {
            if (false) {}
            return 'foo';
        }
        ;
        "
    `);
});

it("should transform asynchronously", async () => {
    const { code } = await swc.transform(`export function foo() {
	if (false) {
	}
	return 'foo';
};`);
    expect(code).toMatchInlineSnapshot(`
        "export function foo() {
            if (false) {}
            return 'foo';
        }
        ;
        "
    `);
});
