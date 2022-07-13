// @strict: true
// @declaration: true
for(let id in z){
    let data = z[id];
    let x = data.notAValue; // Error
}
function bar(arrayish, objectish, indirectArrayish) {
    let arr;
    arr = arrayish;
    arr = objectish;
    arr = indirectArrayish;
}
let abc = stringifyArray(void 0);
let def = stringifyPair(void 0);
