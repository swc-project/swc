import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Class = function Class() {
    "use strict";
    _class_call_check(this, Class);
}, SubClass = function(Class) {
    "use strict";
    _inherits(SubClass, Class);
    var _super = _create_super(SubClass);
    function SubClass() {
        return _class_call_check(this, SubClass), _super.call(this);
    }
    return SubClass;
}(Class), SubD = function(D) {
    "use strict";
    _inherits(SubD, D);
    var _super = _create_super(SubD);
    function SubD() {
        return _class_call_check(this, SubD), _super.call(this);
    }
    return SubD;
}(function D() {
    "use strict";
    _class_call_check(this, D);
});
function d0() {
    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: new Class()
    }).x;
}
new Class(), d0({
    x: 1
}), d0({
    x: {}
}), d0({
    x: "string"
}), ({
    x: new Class()
}).x, ({
    x: new SubClass()
}).x, ({
    y: new SubD()
}).y, ({
    y: new SubClass()
}).y, ({
    y: new Class()
}).y, ({}).y;
