import * as swcHelpers from "@swc/helpers";
// @target: ES6
// @module: commonjs
// @filename: a.ts
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
swcHelpers.asyncToGenerator(function*() {
    const value = yield x;
})();
