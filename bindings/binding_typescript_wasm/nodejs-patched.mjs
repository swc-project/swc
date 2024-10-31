import { transformSync } from "./pkg/wasm.js";

console.log("Begin 1");
console.log(
	transformSync(`
export function foo() {
	return 'foo';
};
`, {
		mode: 'strip-only',
		// default transform will only work when mode is "transform"
		transform: {
			verbatimModuleSyntax: true,
			nativeClassProperties: true,
			noEmptyExport: true,
			importNotUsedAsValues: "preserve",
		},
	}).code,
);
console.log("End 1");

console.log("Begin 2");
console.log(
	transformSync(`
export function foo() {
	if (false) {
	}
	return 'foo';
};
`, {
		mode: 'strip-only',
		// default transform will only work when mode is "transform"
		transform: {
			verbatimModuleSyntax: true,
			nativeClassProperties: true,
			noEmptyExport: true,
			importNotUsedAsValues: "preserve",
		},
	}).code,
);
console.log("End 2");