let value = 1;

using res = null;

export default value;
export const next = ++value;

process.on("exit", () => {
  // `exports.default` is the CommonJS form of the default export.
  const result = JSON.stringify([exports.default, next]);
  console.log(result);
  if (result !== "[1,2]") {
    throw new Error(`unexpected exports: ${result}`);
  }
});
