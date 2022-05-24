import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Class = function() {
    "use strict";
    _class_call_check(this, Class);
}, SubClass = function(Class1) {
    "use strict";
    _inherits(SubClass, Class1);
    var _super = _create_super(SubClass);
    function SubClass() {
        return _class_call_check(this, SubClass), _super.call(this);
    }
    return SubClass;
}(Class), D = function() {
    "use strict";
    _class_call_check(this, D);
}, SubD = function(D1) {
    "use strict";
    _inherits(SubD, D1);
    var _super = _create_super(SubD);
    function SubD() {
        return _class_call_check(this, SubD), _super.call(this);
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
