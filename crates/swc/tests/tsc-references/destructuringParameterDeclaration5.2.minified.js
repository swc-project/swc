//// [destructuringParameterDeclaration5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Class = function Class() {
    _class_call_check(this, Class);
}, SubClass = /*#__PURE__*/ function(Class) {
    function SubClass() {
        return _class_call_check(this, SubClass), _call_super(this, SubClass);
    }
    return _inherits(SubClass, Class), SubClass;
}(Class), SubD = /*#__PURE__*/ function(D) {
    function SubD() {
        return _class_call_check(this, SubD), _call_super(this, SubD);
    }
    return _inherits(SubD, D), SubD;
}(function D() {
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
}).y;
