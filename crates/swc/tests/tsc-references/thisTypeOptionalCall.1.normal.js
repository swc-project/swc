//// [thisTypeOptionalCall.ts]
function maybeBind(obj, fn) {
    var _fn_bind, _object;
    return (_object = fn) === null || _object === void 0 ? void 0 : (_fn_bind = _object.bind) === null || _fn_bind === void 0 ? void 0 : _fn_bind.call(_object, obj);
}
