import * as swcHelpers from "@swc/helpers";
var Class = function() {
    swcHelpers.classCallCheck(this, Class);
}, SubClass = function(Class1) {
    swcHelpers.inherits(SubClass, Class1);
    var _super = swcHelpers.createSuper(SubClass);
    function SubClass() {
        return swcHelpers.classCallCheck(this, SubClass), _super.call(this);
    }
    return SubClass;
}(Class), D = function() {
    swcHelpers.classCallCheck(this, D);
}, SubD = function(D1) {
    swcHelpers.inherits(SubD, D1);
    var _super = swcHelpers.createSuper(SubD);
    function SubD() {
        return swcHelpers.classCallCheck(this, SubD), _super.call(this);
    }
    return SubD;
}(D);
function d0() {
    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: new Class()
    }).x;
}
function d1(param) {
    param.x;
}
function d2(param) {
    param.x;
}
function d3(param) {
    param.y;
}
new Class(), d0({
    x: 1
}), d0({
    x: {}
}), d0({
    x: "string"
}), d1({
    x: new Class()
}), d1({
    x: {}
}), d1({
    x: "string"
}), d2({
    x: new SubClass()
}), d2({
    x: {}
}), d3({
    y: new SubD()
}), d3({
    y: new SubClass()
}), d3({
    y: new Class()
}), d3({}), d3({
    y: 1
}), d3({
    y: "world"
});
