//// [emptyObjectBindingPatternParameter01.ts]
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
function f(param) {
    var ref = _object_destructuring_empty(param);
    var x, y, z;
}
