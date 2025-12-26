//// [inferringClassMembersFromAssignments.ts]
//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    function C() {
        var _this = this;
        _class_call_check(this, C), this.prop = function() {
            Math.random() ? _this.inPropertyDeclaration = 0 : _this.inPropertyDeclaration = "string";
        }, Math.random() ? this.inConstructor = 0 : this.inConstructor = "string", this.inMultiple = 0;
    }
    var _proto = C.prototype;
    return _proto.method = function() {
        Math.random() ? (this.inMethod = 0, this.inMethodNullable = null) : (this.inMethod = "string", this.inMethodNullable = void 0), this.inMultiple = "string", this.inMultipleMethods = "string";
    }, _proto.get = function() {
        Math.random() ? this.inGetter = 0 : this.inGetter = "string", this.inMultiple = !1, this.inMultipleMethods = !1;
    }, _proto.set = function() {
        Math.random() ? this.inSetter = 0 : this.inSetter = "string";
    }, C.method = function() {
        Math.random() ? this.inStaticMethod = 0 : this.inStaticMethod = "string";
    }, C.get = function() {
        Math.random() ? this.inStaticGetter = 0 : this.inStaticGetter = "string";
    }, C.set = function() {
        Math.random() ? this.inStaticSetter = 0 : this.inStaticSetter = "string";
    }, C;
}();
C.prop = function() {
    Math.random() ? C.inStaticPropertyDeclaration = 0 : C.inStaticPropertyDeclaration = "string";
};
//// [b.ts]
var c = new C();
c.inConstructor, c.inMethod, c.inGetter, c.inSetter, c.inPropertyDeclaration, c.inNestedArrowFunction, c.inMultiple, c.inMultipleMethods, c.inMethodNullable, C.inStaticMethod, C.inStaticGetter, C.inStaticSetter, C.inStaticPropertyDeclaration, C.inStaticNestedArrowFunction;
