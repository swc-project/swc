//// [destructuringParameterDeclaration8.ts]
function test(param) {
    param.method, param.nested.p;
}
test({}), test({
    method: 'x',
    nested: {
        p: 'a'
    }
}), test({
    method: 'z',
    nested: {
        p: 'b'
    }
}), test({
    method: 'one',
    nested: {
        p: 'a'
    }
});
