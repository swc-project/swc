//// [thisTypeOptionalCall.ts]
function maybeBind(obj, fn) {
    return fn === null || fn === void 0 ? void 0 : fn.bind(obj);
}
