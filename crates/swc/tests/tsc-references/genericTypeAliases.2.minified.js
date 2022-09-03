//// [genericTypeAliases.ts]
var ls, x, y, z, s, p, tree = {
    left: {
        left: 0,
        right: {
            left: 1,
            right: 2
        }
    },
    right: 3
};
function f() {}
function g() {}
ls = "eager", ls = function() {
    return "lazy";
}, y = x = y, x = "string", x = {
    x: "hello"
}, x = {
    x: {
        x: "world"
    }
}, z = 42, z = {
    x: 42
}, z = {
    x: {
        x: 42
    }
}, s = "hello", p.a = 1, p.b = 2, p.tag = "test";
var a = f(), b = g();
a = b;
