import { maybeNull } from "lib";
// The annotation also asserts the initializer is not nullish, so the
// `TypeError` that destructuring `null` would throw is dropped with it.
const /*#__PURE__*/ { a } = maybeNull;
const { b } = maybeNull;
console.log("done");
