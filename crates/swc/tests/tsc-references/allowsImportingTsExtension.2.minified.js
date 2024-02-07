//// [allowsImportingTsExtension.ts]
//// [a.ts]
export class A {
}
//// [a.d.ts]
export class A {
}
//// [b.ts]
import "./a.ts";
import("./a.ts");
//// [c.ts]
import "./a.d.ts";
import("./a.d.ts");
