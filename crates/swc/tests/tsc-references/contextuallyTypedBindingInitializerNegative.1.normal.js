//// [contextuallyTypedBindingInitializerNegative.ts]
function f(param) {
    var tmp = param.show, showRename = tmp === void 0 ? function(v) {
        return v;
    } : tmp;
}
function f2(param) {
    var tmp = param["show"], showRename = tmp === void 0 ? function(v) {
        return v;
    } : tmp;
}
function f3(param) {
    var tmp = param["show"], showRename = tmp === void 0 ? function(v) {
        return v;
    } : tmp;
}
function ff(param) {
    var tmp = param.nested, nestedRename = tmp === void 0 ? {
        show: function(v) {
            return v;
        }
    } : tmp;
}
var _ref = {
    stringIdentity: function(x) {
        return x;
    }
}, tmp = _ref.stringIdentity, id = tmp === void 0 ? function(arg) {
    return arg.length;
} : tmp;
function g(param) {
    var _param_prop = param.prop, prop = _param_prop === void 0 ? [
        101,
        1234
    ] : _param_prop;
}
function h(param) {
    var _param_prop = param.prop, prop = _param_prop === void 0 ? "baz" : _param_prop;
}
