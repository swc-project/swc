var a;
function f(b) {
    return [b, b, b];
}
for (var c in ((a = console), f(a))) console.log(c);
