//// [decls.d.ts]
//// [a.js]
function concat() {
    for(var s = "", i = 0, l = arguments.length; i < l; i++)s += arguments[i];
    return s;
}
function correct() {
    arguments;
}
correct(1, 2, 3);
