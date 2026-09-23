import { obj } from "lib";
// The access is moved by inlining before the drop runs; keying on `lo`
// keeps the annotation attached.
function f() {
    /*#__PURE__*/ obj.a;
    return 1;
}
console.log(f());
