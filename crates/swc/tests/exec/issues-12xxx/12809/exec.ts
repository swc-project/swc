const log = [];
{
  using inner = {
    [Symbol.dispose]() {
      log.push("inner");
    },
  };
}
using res = {
  [Symbol.dispose]() {
    log.push(a, b, c, d, e, f);
    console.log(JSON.stringify(log));
  },
};
export const a = "a";
export let b = "b";
export var c = "c";
export const { d, e: [e] } = { d: "d", e: ["e"] },
  f = "f";
export { log };
