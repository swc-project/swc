import { basename } from "node:path";
import args from "data:text/javascript,export default JSON.stringify(process.argv.slice(1))";
console.log(basename("/fixture/node-exec.mjs"));
console.log(JSON.stringify(process.argv.slice(1)));
console.log(args);
console.log(import.meta.url.startsWith("file:"));
