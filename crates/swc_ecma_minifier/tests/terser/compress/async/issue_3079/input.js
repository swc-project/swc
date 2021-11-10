(async) => 1;
var async = (async) => async;
console.log(async(1));
async = (async) => async;
console.log(async(2));
console.log({ m: (async) => (async ? "3" : "4") }.m(true));
