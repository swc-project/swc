//// [destructuringParameterDeclaration5.ts]
// Parameter Declaration with generic
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Class = function Class() {
    "use strict";
    _class_call_check(this, Class);
};
var SubClass = /*#__PURE__*/ function(Class) {
    "use strict";
    _inherits(SubClass, Class);
    function SubClass() {
        _class_call_check(this, SubClass);
        return _call_super(this, SubClass);
    }
    return SubClass;
}(Class);
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var SubD = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(SubD, D);
    function SubD() {
        _class_call_check(this, SubD);
        return _call_super(this, SubD);
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
