// Property reads of the Annex B aliases (not calls)
console.log("".trimLeft, "".trimRight, "".trimStart, "".trimEnd);
console.log("".trimLeft === String.prototype.trimLeft);
// Feature detection as written in core-js
export const forced = "".trimLeft !== String.prototype.trimStart;
