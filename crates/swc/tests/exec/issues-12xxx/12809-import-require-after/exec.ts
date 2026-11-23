let disposed = false;

using res = {
  [Symbol.dispose]() {
    disposed = true;
  },
};

import path = require("node:path");
export const sep = path.sep;

process.on("exit", () => {
  console.log(disposed, sep);
  if (!disposed || sep !== path.sep) {
    throw new Error(`unexpected state: ${disposed} ${sep}`);
  }
});
