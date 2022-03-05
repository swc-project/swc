import * as swcHelpers from "@swc/helpers";
var Class = function Class() {
    "use strict";
    swcHelpers.classCallCheck(this, Class);
};
var SubClass = /*#__PURE__*/ function(Class) {
    "use strict";
    swcHelpers.inherits(SubClass, Class);
    var _super = swcHelpers.createSuper(SubClass);
    function SubClass() {
        swcHelpers.classCallCheck(this, SubClass);
        return _super.call(this);
    }
    return SubClass;
}(Class);
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var SubD = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(SubD, D);
    var _super = swcHelpers.createSuper(SubD);
    function SubD() {
        swcHelpers.classCallCheck(this, SubD);
        return _super.call(this);
    }
    return SubD;
}(D);
function d0() {
    var x = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: new Class()
    }).x;
}
function d1(param) {
    var x = param.x;
}
function d2(param) {
    var x = param.x;
}
function d3(param) {
    var y = param.y;
}
function d4() {
    var y = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        y: new D()
    }).y;
}
var obj = new Class();
d0({
    x: 1
});
d0({
    x: {}
});
d0({
    x: "string"
});
d1({
    x: new Class()
});
d1({
    x: {}
});
d1({
    x: "string"
});
d2({
    x: new SubClass()
});
d2({
    x: {}
});
d3({
    y: new SubD()
});
d3({
    y: new SubClass()
});
// Error
d3({
    y: new Class()
});
d3({});
d3({
    y: 1
});
d3({
    y: "world"
});
