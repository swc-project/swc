const swc = require("../pkg");

describe("minify", () => {
    it("should work", async () => {
        const output = await swc.minify(
            `{
            const a = 1;
            console.log(a);
        }`,
            {}
        );

        expect(output).toMatchSnapshot();
    });
});
