function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var _this1 = this;
var C = // @out: output.js
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @filename: a.js
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        var _this = this;
        _classCallCheck(this, C);
        this.prop = function() {
            if (Math.random()) {
                _this.inPropertyDeclaration = 0;
            } else {
                _this.inPropertyDeclaration = "string";
            }
        };
        if (Math.random()) {
            this.inConstructor = 0;
        } else {
            this.inConstructor = "string";
        }
        this.inMultiple = 0;
    }
    _createClass(C, [
        {
            key: "method",
            value: function method() {
                var _this = this;
                if (Math.random()) {
                    this.inMethod = 0;
                    this.inMethodNullable = null;
                } else {
                    this.inMethod = "string";
                    this.inMethodNullable = undefined;
                }
                this.inMultiple = "string";
                this.inMultipleMethods = "string";
                var action = function() {
                    if (Math.random()) {
                        _this.inNestedArrowFunction = 0;
                    } else {
                        _this.inNestedArrowFunction = "string";
                    }
                };
            }
        },
        {
            key: "get",
            value: function get() {
                if (Math.random()) {
                    this.inGetter = 0;
                } else {
                    this.inGetter = "string";
                }
                this.inMultiple = false;
                this.inMultipleMethods = false;
            }
        },
        {
            key: "set",
            value: function set() {
                if (Math.random()) {
                    this.inSetter = 0;
                } else {
                    this.inSetter = "string";
                }
            }
        }
    ], [
        {
            key: "method",
            value: function method() {
                var _this = this;
                if (Math.random()) {
                    this.inStaticMethod = 0;
                } else {
                    this.inStaticMethod = "string";
                }
                var action = function() {
                    if (Math.random()) {
                        _this.inStaticNestedArrowFunction = 0;
                    } else {
                        _this.inStaticNestedArrowFunction = "string";
                    }
                };
            }
        },
        {
            key: "get",
            value: function get() {
                if (Math.random()) {
                    this.inStaticGetter = 0;
                } else {
                    this.inStaticGetter = "string";
                }
            }
        },
        {
            key: "set",
            value: function set() {
                if (Math.random()) {
                    this.inStaticSetter = 0;
                } else {
                    this.inStaticSetter = "string";
                }
            }
        }
    ]);
    return C;
}();
C.prop = function() {
    if (Math.random()) {
        _this1.inStaticPropertyDeclaration = 0;
    } else {
        _this1.inStaticPropertyDeclaration = "string";
    }
};
// @filename: b.ts
var c = new C();
var stringOrNumber;
var stringOrNumber = c.inConstructor;
var stringOrNumberOrUndefined;
var stringOrNumberOrUndefined = c.inMethod;
var stringOrNumberOrUndefined = c.inGetter;
var stringOrNumberOrUndefined = c.inSetter;
var stringOrNumberOrUndefined = c.inPropertyDeclaration;
var stringOrNumberOrUndefined = c.inNestedArrowFunction;
var stringOrNumberOrBoolean;
var number;
var number = c.inMultiple;
var stringOrBooleanOrUndefined;
var stringOrBooleanOrUndefined = c.inMultipleMethods;
var any;
var any = c.inMethodNullable;
var stringOrNumberOrUndefined = C.inStaticMethod;
var stringOrNumberOrUndefined = C.inStaticGetter;
var stringOrNumberOrUndefined = C.inStaticSetter;
var stringOrNumberOrUndefined = C.inStaticPropertyDeclaration;
var stringOrNumberOrUndefined = C.inStaticNestedArrowFunction;
