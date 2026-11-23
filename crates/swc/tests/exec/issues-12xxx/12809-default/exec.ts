const log: string[] = [];

using res = {
  [Symbol.dispose]() {
    const result = JSON.stringify(log);
    console.log(result);
    if (result !== '["default","named","end"]') {
      throw new Error(`unexpected evaluation order: ${result}`);
    }
  },
};

export default log.push("default");
export const named = log.push("named");
log.push("end");
