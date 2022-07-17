// @module: commonjs
// @target: es6
// @noImplicitAny: false
// @declaration: true
import(getSpecifier());
var p0 = import("".concat(directory, "\\").concat(moduleFile));
var p1 = import(getSpecifier());
var p2 = import(whatToLoad ? getSpecifier() : "defaulPath");
function returnDynamicLoad(path) {
    return import(path);
}
