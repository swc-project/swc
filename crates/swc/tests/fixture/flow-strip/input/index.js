import type { Foo } from "./foo";
opaque type ID = string;
type Box = {| +a: number, ...Other |};
declare module.exports: { value: number };
declare export default number;

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
