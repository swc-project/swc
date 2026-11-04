import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
(()=>_async_to_generator(function*() {
        const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
        const result = (yield sleep()) || "fallback";
        console.log(result);
    })())();
