var a;
function f(b) {
    console.log(a === b);
    a = b;
}
function g() {}
for (var i = 3; --i >= 0; ) f(g);
