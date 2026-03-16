import type { Foo } from "./foo";
opaque type ID = string;
type Box = {| +a: number, ...Other |};
declare module.exports: { value: number };
declare export default number;
declare export { Foo, type Bar as Baz } from "./foo";
declare export * from "./foo";
declare export * as ns from "./foo";

class C {
  +x: number;
  -y: string;
}

function hasValue(x: mixed): boolean %checks(x != null) {
  return x != null;
}

const value: ID = (foo: any);
export const out = value;
export const ok = hasValue(value);
export const CRef = C;
