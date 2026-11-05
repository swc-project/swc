const fs = require("node:fs");
const path = require("node:path");
const nodejsSupport = require("../pkg");

for (const [suite, api] of [
    ["tokenize", nodejsSupport.tokenize],
    ["awaits", nodejsSupport.findTopLevelAwaits],
    ["recoverable", nodejsSupport.isRecoverableError],
]) {
    describe(suite, () => {
        const dir = path.join(__dirname, "fixtures", suite);
        for (const file of fs.readdirSync(dir)) {
            const cases = JSON.parse(
                fs.readFileSync(path.join(dir, file), "utf8")
            );
            for (const { source, expected } of cases) {
                it(`${file}: ${JSON.stringify(source)}`, () => {
                    expect(api(source)).toEqual(expected);
                    expect(api(new TextEncoder().encode(source))).toEqual(
                        expected
                    );
                });
            }
        }

        it("rejects invalid argument types and invalid UTF-8", () => {
            expect(() => api(42)).toThrow();
            expect(() => api(new Uint8Array([0xff]))).toThrow();
        });
    });
}
