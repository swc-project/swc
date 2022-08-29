//// [destructuringParameterDeclaration8.ts]
// explicit type annotation should cause `method` to have type 'x' | 'y'
// both inside and outside `test`.
function test(param) {
    var _method = param.method, method = _method === void 0 ? "z" : _method, _nested = param.nested, _p = _nested.p, p = _p === void 0 ? "c" : _p;
    method;
    p;
}
test({});
test({
    method: "x",
    nested: {
        p: "a"
    }
});
test({
    method: "z",
    nested: {
        p: "b"
    }
});
test({
    method: "one",
    nested: {
        p: "a"
    }
});
