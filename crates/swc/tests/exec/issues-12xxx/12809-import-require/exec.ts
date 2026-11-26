import path = require("node:path");

const log: string[] = [];

using res = {
  [Symbol.dispose]() {
    log.push(`dispose ${sep}`);
    const result = JSON.stringify(log);
    console.log(result);
    if (result !== JSON.stringify(["end", `dispose ${path.sep}`])) {
      throw new Error(`unexpected log: ${result}`);
    }
  },
};

export const sep = path.sep;
log.push("end");
