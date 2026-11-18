function f(c, d) {
    if (c) while(log());
    if (d) while(log());
}
var n = 0;
function log() {
    console.log(++n);
    return false;
}
f(true, true);
