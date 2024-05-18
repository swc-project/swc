const path = require("path");
const swc = require("../..");

it("should emit source maps as inline if requested", () => {
    const filename = path.resolve(__dirname + "/../../tests/issue-1581/foo.ts");
    // We only check if it's not empty sourcemap.
    expect(swc.transformFileSync(filename).code.trim()).not.toContain(
        `eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzdGRvdXQifQ==`
    );
});
