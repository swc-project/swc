import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
let x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
_async_to_generator(function*() {
    yield x;
})();
