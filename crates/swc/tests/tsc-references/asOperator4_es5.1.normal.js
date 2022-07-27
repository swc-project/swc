//@module: commonjs
//@filename: foo.ts
export function foo() {}
//@filename: bar.ts
import { foo } from "./foo";
// These should emit identically
foo;
foo;
