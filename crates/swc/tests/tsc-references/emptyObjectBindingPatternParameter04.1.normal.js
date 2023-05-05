//// [emptyObjectBindingPatternParameter04.ts]
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
function f() {
    var ref = _object_destructuring_empty(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: 1,
        b: "2",
        c: true
    });
    var x, y, z;
}
