import { maybeNull } from "lib";
// The annotation asserts the initializer is not nullish. Honoring it
// removes the `TypeError` that destructuring `null` would throw, which
// is the promise the user made by writing the annotation.
const /*#__PURE__*/ { a } = maybeNull;
// Unannotated, the pattern is kept precisely because it can throw.
const { b } = maybeNull;
console.log("done");
