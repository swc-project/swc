(async)=>1
;
var async = (async1)=>async1
;
console.log(async(1));
async = (async2)=>async2
;
console.log(async(2));
console.log(({
    m: (async3)=>async3 ? "3" : "4"
}).m(true));
