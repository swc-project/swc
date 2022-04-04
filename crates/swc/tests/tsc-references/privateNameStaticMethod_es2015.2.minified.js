import * as swcHelpers from "@swc/helpers";
class A1 {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(A1, A1, function(param) {
            return "";
        }).call(A1, ""), swcHelpers.classStaticPrivateMethodGet(A1, A1, function(param) {
            return "";
        }).call(A1, 1), swcHelpers.classStaticPrivateMethodGet(A1, A1, function(param) {
            return "";
        }).call(A1);
    }
}
