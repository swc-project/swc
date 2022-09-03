//// [a.js]
var n;
function f() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    var l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
    l.push(1), l.push("ok");
}
