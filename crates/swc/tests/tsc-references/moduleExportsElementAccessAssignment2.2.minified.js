//// [file1.js]
var GlobalThing = {
    x: 12
};
function f(type, ctor, exports) {
    void 0 !== exports && (exports["AST_" + type] = ctor);
}
//// [ref.js]
GlobalThing.x;
