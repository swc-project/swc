//// [mappedTypes4.ts]
var x1, z1;
function boxify(obj) {
    if ("object" == typeof obj) {
        var result = {};
        for(var k in obj)result[k] = {
            value: obj[k]
        };
        return result;
    }
    return obj;
}
function f1(x) {
    return boxify(x);
}
