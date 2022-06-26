import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
_async_to_generator(function*() {
    const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
    const result = (yield sleep()) || "fallback";
    console.log(result);
})();
