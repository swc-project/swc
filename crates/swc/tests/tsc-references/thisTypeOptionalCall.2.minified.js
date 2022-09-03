//// [thisTypeOptionalCall.ts]
function maybeBind(obj, fn) {
    return null == fn ? void 0 : fn.bind(obj);
}
