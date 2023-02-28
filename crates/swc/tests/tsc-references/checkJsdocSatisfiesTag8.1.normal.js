//// [checkJsdocSatisfiesTag8.ts]
//// [/a.js]
/** @typedef {Object.<string, boolean>} Facts */ // Should be able to detect a failure here
var x = /** @satisfies {Facts} */ {
    m: true,
    s: "false"
};
