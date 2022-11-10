//// [contextuallyTypedBindingInitializer.ts]
function f(param) {
    var _param_show = param.show, show = _param_show === void 0 ? function(v) {
        return v.toString();
    } : _param_show;
}
function f2(param) {
    var tmp = param["show"], showRename = tmp === void 0 ? function(v) {
        return v.toString();
    } : tmp;
}
function f3(param) {
    var tmp = param["show"], showRename = tmp === void 0 ? function(v) {
        return v.toString();
    } : tmp;
}
function ff(param) {
    var _param_nested = param.nested, nested = _param_nested === void 0 ? {
        show: function(v) {
            return v.toString();
        }
    } : _param_nested;
}
function g(param) {
    var _param_prop = param.prop, prop = _param_prop === void 0 ? [
        "hello",
        1234
    ] : _param_prop;
}
function h(param) {
    var _param_prop = param.prop, prop = _param_prop === void 0 ? "foo" : _param_prop;
}
var _ref = {
    stringIdentity: function(x) {
        return x;
    }
}, tmp = _ref.stringIdentity, id = tmp === void 0 ? function(arg) {
    return arg;
} : tmp;
