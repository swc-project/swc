var f = console.log;
var o = {
    undefined: 3,
    NaN: 4,
    Infinity: 5
};
if (o) {
    f(undefined, void 0);
    f(NaN, 0 / 0);
    f(Infinity, 1 / 0);
    f(-Infinity, -(1 / 0));
    f(2 + 7 + undefined, 2 + 7 + void 0);
}
with (o){
    f(undefined, void 0);
    f(NaN, 0 / 0);
    f(Infinity, 1 / 0);
    f(-Infinity, -(1 / 0));
    f(2 + 7 + undefined, 2 + 7 + void 0);
}
