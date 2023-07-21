//// [thisTypeOptionalCall.ts]
function maybeBind(obj, fn) {
    var _fn;
    return (_fn = fn) === null || _fn === void 0 ? void 0 : _fn.bind(obj);
}
