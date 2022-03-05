import * as swcHelpers from "@swc/helpers";
// @target: ES6
// @module: umd
// @filename: a.ts
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
swcHelpers.asyncToGenerator(function*() {
    const value = yield x;
})();
