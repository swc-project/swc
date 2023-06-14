//// [thisTypeOptionalCall.ts]
function maybeBind(obj, fn) {
    var _fn_bind, _this;
    return (_this = fn) === null || _this === void 0 ? void 0 : (_fn_bind = _this.bind) === null || _fn_bind === void 0 ? void 0 : _fn_bind.call(_this, obj);
}
