//// [allowsImportingTsExtension.ts]
//// [a.ts]
export class A {
}
//// [a.d.ts]
export class A {
}
//// [b.ts]
import "./a.ts"; // error
const aPromise = import("./a.ts"); // error
//// [c.ts]
import "./a.d.ts"; // error
const aPromise = import("./a.d.ts"); // error
