import * as swcHelpers from "@swc/helpers";
class A1 {
    constructor(name){
        swcHelpers.classStaticPrivateFieldSpecSet(A1, A1, _prop, ""), swcHelpers.classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""), console.log(swcHelpers.classStaticPrivateFieldSpecGet(A1, A1, _prop)), console.log(swcHelpers.classStaticPrivateFieldSpecGet(A1, A1, _roProp));
    }
}
var _prop = {
    get: get_prop,
    set: function(param) {}
}, _roProp = {
    get: get_roProp,
    set: void 0
};
function get_prop() {
    return "";
}
function get_roProp() {
    return "";
}
