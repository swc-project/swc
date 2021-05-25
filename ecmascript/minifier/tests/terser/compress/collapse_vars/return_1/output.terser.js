var log = console.log;
function f(b, c) {
    if (b) return b;
    log(c);
}
f(false, 1);
f(true, 2);
