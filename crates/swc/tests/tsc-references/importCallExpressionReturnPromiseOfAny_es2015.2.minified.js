export class C {
}
import(`${directory}\\${moduleFile}`), import(getSpecifier());
var p1 = (import(ValidSomeCondition() ? "./0" : "externalModule"), import(getSpecifier()));
import(getSpecifier()), import(whatToLoad ? getSpecifier() : "defaulPath"), p1.then((zero)=>zero.foo()), import(getSpecifier());
