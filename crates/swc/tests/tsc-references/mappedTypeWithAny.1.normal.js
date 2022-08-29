//// [mappedTypeWithAny.ts]
for(var id in z){
    var data = z[id];
    var x = data.notAValue; // Error
}
function bar(arrayish, objectish, indirectArrayish) {
    var arr;
    arr = arrayish;
    arr = objectish;
    arr = indirectArrayish;
}
var abc = stringifyArray(void 0);
var def = stringifyPair(void 0);
