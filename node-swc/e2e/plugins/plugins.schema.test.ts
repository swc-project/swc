const { preserveBinaries } = require("../utils");

describe("Plugins", () => {
    // Plugin integration test requires different node bindings build with specific features enabled,
    // Preserve current binary for other unit tests.
    beforeAll(() => preserveBinaries("node", "tmp_node_swc_fixture_test"));
    afterAll(() => preserveBinaries("tmp_node_swc_fixture_test", "node"));

    describe("Transform AST schema versions", () => {
        test.todo("Host v1");
    });
});
