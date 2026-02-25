const swc = require("../pkg");

describe("html minify", () => {
    it("supports sync minification", () => {
        const output = swc.minifySync(
            "<!doctype html><html><body><div class='a'>  Hello   world  </div></body></html>",
            {
                collapseWhitespaces: "all",
                removeComments: true,
            }
        );

        expect(output.code).toBe("<!doctype html><div class=a>Hello world</div>");
        expect(output.errors).toBeUndefined();
    });

    it("supports async minification", async () => {
        const output = await swc.minify("<div>  hello   wasm  </div>", {
            collapseWhitespaces: "all",
        });

        expect(output.code).toBe("<div>hello wasm</div>");
    });

    it("supports fragment minification", async () => {
        const output = await swc.minifyFragment("<span>  foo  </span>", {
            collapseWhitespaces: "all",
            contextElement: {
                tagName: "template",
                namespace: "http://www.w3.org/1999/xhtml",
                attributes: [],
                isSelfClosing: false,
            },
        });

        expect(output.code).toBe("<span>foo</span>");
    });
});
