function boxify(obj1) {
    if (typeof obj1 === "object") {
        var result = {
        };
        for(var k in obj1){
            result[k] = {
                value: obj1[k]
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
