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
