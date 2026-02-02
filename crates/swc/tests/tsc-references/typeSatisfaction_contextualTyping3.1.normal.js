//// [typeSatisfaction_contextualTyping3.ts]
// see https://github.com/microsoft/TypeScript/issues/53920#issuecomment-1516616255
var obj = {
    foo: function foo() {
        var param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default";
        return param;
    }
};
var obj2 = {
    foo: function foo() {
        var param = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default";
        return param;
    }
};
var fn = function fn() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "ok";
    return null;
};
fn();
fn(32);
