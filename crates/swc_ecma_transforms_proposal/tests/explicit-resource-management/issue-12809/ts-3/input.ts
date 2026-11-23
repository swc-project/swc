import type { Payload } from "./types";

using res = {
  [Symbol.dispose]() {
    console.log(value);
  },
};

export namespace N {
  export function next() {
    return 42;
  }
}
export const value = N.next();

export enum E {
  A = 1,
}
export enum E {
  B = 2,
}

export class C {}
export namespace C {
  export const x = 3;
}

export function f() {}
export namespace f {
  export const y = 4;
}

export declare const ambient: number;
export const all = [E.A, E.B, C.x, f.y];
export default Payload;
