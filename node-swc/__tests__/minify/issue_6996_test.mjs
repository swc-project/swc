import swc from "../../..";

it("should not throw when keep_fnames is on", async () => {
    async function minify() {
        const { code } = await swc.transform('function Foo() {}', {
            jsc: {
                minify: {
                    keep_fnames: true,
                },
            },
        });
        return code;
    }
    await expect(minify()).resolves.toEqual('function Foo() {}\n');
});
