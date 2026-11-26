export { default as path } from "node:path";

if (typeof exports !== "undefined") {
    expect(module.exports.path).toBe(require("node:path"));
}
