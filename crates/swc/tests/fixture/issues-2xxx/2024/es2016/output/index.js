var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
_async_to_generator._(function*() {
    const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
    const result = (yield sleep()) || "fallback";
    console.log(result);
})();
