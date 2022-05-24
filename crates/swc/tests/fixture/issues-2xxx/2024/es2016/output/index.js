import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
_async_to_generator(function*() {
    const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
    const result = (yield sleep()) || "fallback";
    console.log(result);
})();
