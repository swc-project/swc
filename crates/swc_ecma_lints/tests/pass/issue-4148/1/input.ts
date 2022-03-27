//a.ts
import type { Foo } from "./b";
const Foo = "hey";

// b.ts
export type Foo = string;
