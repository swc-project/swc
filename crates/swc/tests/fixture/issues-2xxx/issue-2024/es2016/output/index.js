import * as swcHelpers from "@swc/helpers";
swcHelpers.asyncToGenerator(function*() {
    const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined)
            , 500)
        )
    ;
    const result = (yield sleep()) || 'fallback';
    console.log(result);
})();
