let x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import x from './a';
_async_to_generator(function*() {
    yield x;
})();
