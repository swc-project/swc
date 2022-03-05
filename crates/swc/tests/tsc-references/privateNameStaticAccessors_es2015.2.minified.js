import * as swcHelpers from "@swc/helpers";
class A1 {
    constructor(name){
        swcHelpers.classStaticPrivateFieldSpecSet(A1, A1, _prop, ""), swcHelpers.classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""), console.log(swcHelpers.classStaticPrivateFieldSpecGet(A1, A1, _prop)), console.log(swcHelpers.classStaticPrivateFieldSpecGet(A1, A1, _roProp));
    }
}
var _prop = {
    get: function() {
        return "";
    },
    set: function(param) {}
}, _roProp = {
    get: function() {
        return "";
    },
    set: void 0
};
