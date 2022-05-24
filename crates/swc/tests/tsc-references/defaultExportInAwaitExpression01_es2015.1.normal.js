import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: ES6
// @module: umd
// @filename: a.ts
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
_async_to_generator(function*() {
    const value = yield x;
})();
