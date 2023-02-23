//// [controlFlowParameter.ts]
function f1() {
    var required = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        throw new Error("bad");
    }();
    console.log("ok"); // should not trigger 'Unreachable code detected.'
}
function f2(a) {
    var required = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
        a = 1;
    }();
    a; // should be number | string | undefined
}
function f3() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, required = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
        a = "";
    }();
    a; // should be number | string
}
function f4() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, b = _ref[a = ""];
    a; // should be string
}
