(async)=>1
;
var async1 = (async)=>async
;
console.log(async1(1));
async1 = (async)=>async
;
console.log(async1(2));
console.log(({
    m: (async)=>async ? "3" : "4"
}).m(true));
