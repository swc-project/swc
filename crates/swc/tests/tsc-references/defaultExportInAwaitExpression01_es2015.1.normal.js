// @target: ES6
// @module: umd
// @filename: a.ts
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
// @filename: b.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import x from './a';
_async_to_generator(function*() {
    const value = yield x;
})();
