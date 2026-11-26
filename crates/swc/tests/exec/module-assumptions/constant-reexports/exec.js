import { basename } from "node:path";

export * from "node:path";
export { basename as name };
export { dirname as __proto__, default as defaultPath } from "node:path";
export { isAbsolute as "is absolute" } from "node:path";
export * as namespace from "node:path";
export let sep = "local";

if (typeof exports !== "undefined") {
    const path = require("node:path");
    const originalBasename = path.basename;
    const originalDirname = path.dirname;
    path.basename = () => "changed";
    path.dirname = () => "changed";

    expect(module.exports.name).toBe(originalBasename);
    expect(module.exports.basename).toBe(originalBasename);
    expect(module.exports.dirname).toBe(originalDirname);
    expect(module.exports.__proto__).toBe(originalDirname);
    expect(Object.getPrototypeOf(module.exports)).toBe(Object.prototype);
    expect(module.exports["is absolute"]).toBe(path.isAbsolute);
    expect(module.exports.defaultPath).toBe(path);
    expect(module.exports.namespace).toBeDefined();
    expect(module.exports.sep).toBe("local");
    sep = "updated";
    expect(module.exports.sep).toBe("updated");
}
