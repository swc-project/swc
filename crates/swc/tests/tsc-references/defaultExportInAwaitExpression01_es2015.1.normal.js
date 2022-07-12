// @target: ES6
// @module: umd
// @filename: a.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
_async_to_generator(function*() {
    const value = yield x;
})();
