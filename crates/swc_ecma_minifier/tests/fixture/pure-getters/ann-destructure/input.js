import { obj } from "lib";
// The annotation asserts the reads are pure and `obj` is not nullish,
// so the unused pattern can be dropped.
const /*#__PURE__*/ { a, b } = obj;
// Without an annotation the pattern must stay.
const { c } = obj;
console.log("done");
