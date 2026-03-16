import type { Foo } from "./foo";
opaque type ID = string;
type Box = {| +a: number, ...Other |};
const value: ID = (foo: any);
export const out = value;
