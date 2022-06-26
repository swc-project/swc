var tree = {
    left: {
        left: 0,
        right: {
            left: 1,
            right: 2
        }
    },
    right: 3
};
var ls;
ls = "eager";
ls = ()=>"lazy";
// Deeply instantiated generics
var x;
var y;
x = y;
y = x;
x = "string";
x = {
    x: "hello"
};
x = {
    x: {
        x: "world"
    }
};
var z;
z = 42;
z = {
    x: 42
};
z = {
    x: {
        x: 42
    }
};
var s;
s = "hello";
var p;
p.a = 1;
p.b = 2;
p.tag = "test";
function f() {
    var x;
    return x;
}
function g() {
    var x;
    return x;
}
// Deeply instantiated generics
var a = f();
var b = g();
a = b;
