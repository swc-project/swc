//// [controlFlowNullishCoalesce.ts]
// assignments in shortcutting rhs
var a;
o !== null && o !== void 0 ? o : a = 1;
a.toString();
var x;
if (x = o !== null && o !== void 0 ? o : true) {
    x;
}
