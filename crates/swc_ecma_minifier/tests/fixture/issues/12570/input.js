// `trimLeft` and `trimRight` are Annex B aliases of `trimStart` and `trimEnd`.
// Reading them from a string literal must not be folded to `undefined`.
console.log(typeof "".trimLeft);
console.log(typeof "".trimRight);
console.log("".trimLeft === "".trimStart);
console.log("".trimRight === "".trimEnd);
console.log("".trimLeft !== "".trimStart);
console.log("".trimRight !== "".trimEnd);
console.log("  x  ".trimLeft() === "x  ");
console.log("  x  ".trimRight() === "  x");
