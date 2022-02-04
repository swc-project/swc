function f(param) {
    var tmp1 = param.show, showRename = tmp1 === void 0 ? function(v) {
        return v;
    } : tmp1;
}
function f2(param) {
    var tmp2 = param["show"], showRename = tmp2 === void 0 ? function(v) {
        return v;
    } : tmp2;
}
function f3(param) {
    var tmp3 = param["show"], showRename = tmp3 === void 0 ? function(v) {
        return v;
    } : tmp3;
}
function ff(param) {
    var tmp4 = param.nested, nestedRename = tmp4 === void 0 ? {
        show: function(v) {
            return v;
        }
    } : tmp4;
}
var ref = {
    stringIdentity: function(x) {
        return x;
    }
}, tmp = ref.stringIdentity, id = tmp === void 0 ? function(arg) {
    return arg.length;
} : tmp;
function g(param) {
    var _prop = param.prop, prop = _prop === void 0 ? [
        101,
        1234
    ] : _prop;
}
function h(param) {
    var _prop = param.prop, prop = _prop === void 0 ? "baz" : _prop;
}
