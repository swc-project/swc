//// [inferringClassMembersFromAssignments.ts]
//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function() {
    function C() {
        var _this = this;
        _class_call_check(this, C), this.prop = function() {
            _this.inPropertyDeclaration = Math.random() ? 0 : "string";
        }, this.inConstructor = Math.random() ? 0 : "string", this.inMultiple = 0;
    }
    var _proto = C.prototype;
    return _proto.method = function() {
        Math.random() ? (this.inMethod = 0, this.inMethodNullable = null) : (this.inMethod = "string", this.inMethodNullable = void 0), this.inMultiple = "string", this.inMultipleMethods = "string";
    }, _proto.get = function() {
        this.inGetter = Math.random() ? 0 : "string", this.inMultiple = !1, this.inMultipleMethods = !1;
    }, _proto.set = function() {
        this.inSetter = Math.random() ? 0 : "string";
    }, C.method = function() {
        this.inStaticMethod = Math.random() ? 0 : "string";
    }, C.get = function() {
        this.inStaticGetter = Math.random() ? 0 : "string";
    }, C.set = function() {
        this.inStaticSetter = Math.random() ? 0 : "string";
    }, C;
}();
C.prop = function() {
    C.inStaticPropertyDeclaration = Math.random() ? 0 : "string";
};
//// [b.ts]
var c = new C();
c.inConstructor, c.inMethod, c.inGetter, c.inSetter, c.inPropertyDeclaration, c.inNestedArrowFunction, c.inMultiple, c.inMultipleMethods, c.inMethodNullable, C.inStaticMethod, C.inStaticGetter, C.inStaticSetter, C.inStaticPropertyDeclaration, C.inStaticNestedArrowFunction;
