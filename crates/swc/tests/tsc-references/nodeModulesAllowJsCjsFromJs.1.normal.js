//// [foo.cjs]
exports.foo = "foo";
//// [bar.ts]
import foo from "./foo.cjs";
foo.foo;
