//// [checkJsdocTypeTagOnObjectProperty2.ts]
//// [0.js]
var lol, obj = {
    bar: 42,
    method1: function(n1) {
        return "42";
    },
    method2: function(n1) {
        return "lol";
    },
    arrowFunc: function() {
        var num = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "0";
        return num + 42;
    },
    lol: lol
};
lol = "string";
var s = obj.method1(0), s1 = obj.method2("0");
