using res = {
  [Symbol.dispose]() {
    console.log(a, b, c, d);
  },
};
export const { a, b: [b] } = { a: 1, b: [2] },
  c = 3;
export let d;
d = 4;
