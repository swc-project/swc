const log: string[] = [];

using res = {
  [Symbol.dispose]() {
    const result = JSON.stringify(log);
    console.log(result);
    if (result !== '["default","named"]') {
      throw new Error(`unexpected evaluation order: ${result}`);
    }
  },
};

export default (class {
  static {
    log.push("default");
  }
});
export const named = log.push("named");
