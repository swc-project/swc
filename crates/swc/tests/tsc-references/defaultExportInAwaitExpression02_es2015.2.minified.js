import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
let x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
_async_to_generator(function*() {
    yield x;
})();
