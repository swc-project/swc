function f(param) {
    var _show = param.show, show = _show === void 0 ? function(v) {
        return v.toString();
    } : _show;
}
function f2(param) {
    var tmp1 = param["show"], showRename = tmp1 === void 0 ? function(v) {
        return v.toString();
    } : tmp1;
}
function f3(param) {
    var tmp2 = param["show"], showRename = tmp2 === void 0 ? function(v) {
        return v.toString();
    } : tmp2;
}
function ff(param) {
    var _nested = param.nested, nested = _nested === void 0 ? {
        show: function(v) {
            return v.toString();
        }
    } : _nested;
}
function g(param) {
    var _prop = param.prop, prop = _prop === void 0 ? [
        "hello",
        1234
    ] : _prop;
}
function h(param) {
    var _prop = param.prop, prop = _prop === void 0 ? "foo" : _prop;
}
var ref = {
    stringIdentity: function(x) {
        return x;
    }
}, tmp = ref.stringIdentity, id = tmp === void 0 ? function(arg) {
    return arg;
} : tmp;
