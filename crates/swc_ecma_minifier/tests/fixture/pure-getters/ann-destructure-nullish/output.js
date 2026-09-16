import { maybeNull } from "lib";
// Unannotated, the pattern is kept precisely because it can throw.
let { b } = maybeNull;
console.log("done");
