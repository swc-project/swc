var a;
function f(b) {
    return [b, b, b];
}
for (var c in f((a = console))) console.log(c);
