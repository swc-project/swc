// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: defaultPath.ts
export class C {
}
import(`${directory}\\${moduleFile}`);
import(getSpecifier());
var p1 = import(ValidSomeCondition() ? "./0" : "externalModule");
var p1 = import(getSpecifier());
var p11 = import(getSpecifier());
const p2 = import(whatToLoad ? getSpecifier() : "defaulPath");
p1.then((zero)=>{
    return zero.foo(); // ok, zero is any
});
let j;
var p3 = import(j = getSpecifier());
function* loadModule(directories) {
    for (const directory1 of directories){
        const path = `${directory1}\\moduleFile`;
        import((yield path));
    }
}
