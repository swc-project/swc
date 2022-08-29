//a.ts
import { Foo } from "./b";
// import type { Foo } from "./b"; has the same behavior
const Foo = "hey";

// b.ts
export type Foo = string;