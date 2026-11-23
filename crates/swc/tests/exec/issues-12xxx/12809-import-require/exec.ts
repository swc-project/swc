import path = require("node:path");

const log: string[] = [];

using res = {
  [Symbol.dispose]() {
    log.push(`dispose ${sep}`);
    console.log(JSON.stringify(log));
  },
};

export const sep = path.sep;
log.push("end");
