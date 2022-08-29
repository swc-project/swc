//// [mappedTypes4.ts]
function boxify(obj) {
    if (typeof obj === "object") {
        var result = {};
        for(var k in obj){
            result[k] = {
                value: obj[k]
            };
        }
        return result;
    }
    return obj;
}
function f1(x) {
    return boxify(x);
}
var x1;
var x1;
var z1;
var z1;
