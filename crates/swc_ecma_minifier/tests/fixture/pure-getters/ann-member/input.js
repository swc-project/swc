import { obj } from "lib";
// Annotated accesses are dropped even though `pure_getters` is off.
/*#__PURE__*/ obj.annotated;
// An unannotated access on the same object is preserved.
obj.plain;
