// @strictNullChecks: true
// @declaration: true
function boxify(obj) {
    if (typeof obj === "object") {
        let result = {};
        for(let k in obj){
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
