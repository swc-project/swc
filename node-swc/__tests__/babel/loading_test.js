const swc = require("../../");


it("should be able to load plugins", () => {
    swc._invokeBabelPlugin('@babel/plugin-proposal-class-properties', {});
});

