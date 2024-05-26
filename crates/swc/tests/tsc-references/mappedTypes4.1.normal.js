//// [mappedTypes4.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function boxify(obj) {
    if ((typeof obj === "undefined" ? "undefined" : _type_of(obj)) === "object") {
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
