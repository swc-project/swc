function test(node) {
    return(// comment from the source code
    (_a1 = node.modifiers) === null || _a1 === void 0 ? void 0 : _a1.filter(function(m) {
        return !ts.isDecorator(m);
    }));
}
