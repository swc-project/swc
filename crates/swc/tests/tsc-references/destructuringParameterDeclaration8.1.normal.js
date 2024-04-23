//// [destructuringParameterDeclaration8.ts]
// explicit type annotation should cause `method` to have type 'x' | 'y'
// both inside and outside `test`.
function test(param) {
    var _param_method = param.method, method = _param_method === void 0 ? 'z' : _param_method, _param_nested = param.nested, _param_nested_p = _param_nested.p, p = _param_nested_p === void 0 ? 'c' : _param_nested_p;
    method;
    p;
}
test({});
test({
    method: 'x',
    nested: {
        p: 'a'
    }
});
test({
    method: 'z',
    nested: {
        p: 'b'
    }
});
test({
    method: 'one',
    nested: {
        p: 'a'
    }
});
