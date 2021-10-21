function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _this1 = this, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        var _this = this;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.prop = function() {
            Math.random() ? _this.inPropertyDeclaration = 0 : _this.inPropertyDeclaration = "string";
        }, Math.random() ? this.inConstructor = 0 : this.inConstructor = "string", this.inMultiple = 0;
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function() {
                Math.random() ? (this.inMethod = 0, this.inMethodNullable = null) : (this.inMethod = "string", this.inMethodNullable = void 0), this.inMultiple = "string", this.inMultipleMethods = "string";
            }
        },
        {
            key: "get",
            value: function() {
                Math.random() ? this.inGetter = 0 : this.inGetter = "string", this.inMultiple = !1, this.inMultipleMethods = !1;
            }
        },
        {
            key: "set",
            value: function() {
                Math.random() ? this.inSetter = 0 : this.inSetter = "string";
            }
        }
    ], staticProps = [
        {
            key: "method",
            value: function() {
                Math.random() ? this.inStaticMethod = 0 : this.inStaticMethod = "string";
            }
        },
        {
            key: "get",
            value: function() {
                Math.random() ? this.inStaticGetter = 0 : this.inStaticGetter = "string";
            }
        },
        {
            key: "set",
            value: function() {
                Math.random() ? this.inStaticSetter = 0 : this.inStaticSetter = "string";
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
C.prop = function() {
    Math.random() ? _this1.inStaticPropertyDeclaration = 0 : _this1.inStaticPropertyDeclaration = "string";
};
var c = new C();
c.inConstructor, c.inMethod, c.inGetter, c.inSetter, c.inPropertyDeclaration, c.inNestedArrowFunction, c.inMultiple, c.inMultipleMethods, c.inMethodNullable, C.inStaticMethod, C.inStaticGetter, C.inStaticSetter, C.inStaticPropertyDeclaration, C.inStaticNestedArrowFunction;
