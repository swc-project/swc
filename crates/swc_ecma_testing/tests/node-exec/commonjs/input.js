const { basename, resolve } = require("node:path");
console.log(basename("/fixture/node-exec.js"));
console.log(JSON.stringify(process.argv.slice(1)));
console.log(resolve(__dirname) === process.cwd());
