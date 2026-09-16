import { obj } from "lib";
// The annotated access is moved by inlining and sequencing before the
// drop runs. Keying the side table on `lo` keeps it attached.
function f() {
    /*#__PURE__*/ obj.a;
    return 1;
}
console.log(f());
