//// [contextuallyTypedBindingInitializer.ts]
function f(param) {
    param.show;
}
function f2(param) {
    param.show;
}
function f3(param) {
    param.show;
}
function ff(param) {
    param.nested;
}
function g(param) {
    param.prop;
}
function h(param) {
    param.prop;
}
var ref = {
    stringIdentity: function(x) {
        return x;
    }
}, tmp = ref.stringIdentity, id = void 0 === tmp ? function(arg) {
    return arg;
} : tmp;
