// @module: commonjs
// @target: es6
// @noImplicitAny: false
// @declaration: true
import(getSpecifier());
var p0 = import(`${directory}\\${moduleFile}`);
var p1 = import(getSpecifier());
const p2 = import(whatToLoad ? getSpecifier() : "defaulPath");
function returnDynamicLoad(path) {
    return import(path);
}
