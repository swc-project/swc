const log = [];
await using res = {
  async [Symbol.asyncDispose]() {
    log.push(a, b, c);
  },
};
export const a = "a";
export let b = "b";
export var c = "c";
export { log };
