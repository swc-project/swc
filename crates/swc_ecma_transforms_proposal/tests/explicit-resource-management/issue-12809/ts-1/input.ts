using res = {
  [Symbol.dispose]() {
    console.log(value, N.inner);
  },
};
export declare const ambient: number;
export const value: number = 1;
export namespace N {
  using nested = {
    [Symbol.dispose]() {
      console.log(inner);
    },
  };
  export const inner = 2;
}
