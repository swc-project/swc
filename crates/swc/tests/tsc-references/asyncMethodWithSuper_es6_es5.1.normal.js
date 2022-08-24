// @target: ES6
// @lib: esnext
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.x = function x() {};
    _proto.y = function y() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    // async method with only call/get on 'super' does not require a binding
    _proto.simple = function simple() {
        var _this = this;
        var _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get_y = function() {
            return _get(_get_prototype_of(B.prototype), "y", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(function() {
            var a, b;
            return _ts_generator(this, function(_state) {
                // call with property access
                _superprop_get_x().call(_this1);
                // call additional property.
                _superprop_get_y().call(_this1);
                // call with element access
                _superprop_get("x").call(_this1);
                a = _superprop_get_x();
                b = _superprop_get("x");
                return [
                    2
                ];
            });
        })();
    };
    // async method with assignment/destructuring on 'super' requires a binding
    _proto.advanced = function advanced() {
        var _this = this;
        var _this1 = this, _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_update = function(_prop) {
            return {
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            };
        }, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, true);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, true);
        };
        return _async_to_generator(function() {
            var f, a, b, ref, ref1;
            return _ts_generator(this, function(_state) {
                f = function() {};
                // call with property access
                _superprop_get_x().call(_this1);
                // call with element access
                _superprop_get("x").call(_this1);
                a = _superprop_get_x();
                b = _superprop_get("x");
                // property access (assign)
                _superprop_set_x(f);
                // element access (assign)
                _superprop_set("x", f);
                // destructuring assign with property access
                (ref = {
                    f: f
                }, _superprop_update_x._ = ref.f, ref);
                // destructuring assign with element access
                (ref1 = {
                    f: f
                }, _superprop_update("x")._ = ref1.f, ref1);
                // property access in arrow
                (function() {
                    return _superprop_get_x().call(_this1);
                });
                // element access in arrow
                (function() {
                    return _superprop_get("x").call(_this1);
                });
                /*#__PURE__*/ // property access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get_x().call(_this1)
                        ];
                    });
                });
                /*#__PURE__*/ // element access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get("x").call(_this1)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.property_access_only_read_only = function property_access_only_read_only() {
        var _this = this;
        var _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        };
        return _async_to_generator(function() {
            var a;
            return _ts_generator(this, function(_state) {
                // call with property access
                _superprop_get_x().call(_this1);
                a = _superprop_get_x();
                // property access in arrow
                (function() {
                    return _superprop_get_x().call(_this1);
                });
                /*#__PURE__*/ // property access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get_x().call(_this1)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.property_access_only_write_only = function property_access_only_write_only() {
        var _this = this;
        var _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, true);
        };
        return _async_to_generator(function() {
            var f, ref;
            return _ts_generator(this, function(_state) {
                f = function() {};
                // property access (assign)
                _superprop_set_x(f);
                // destructuring assign with property access
                (ref = {
                    f: f
                }, _superprop_update_x._ = ref.f, ref);
                // property access (assign) in arrow
                (function() {
                    return _superprop_set_x(f);
                });
                /*#__PURE__*/ // property access (assign) in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_set_x(f)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.element_access_only_read_only = function element_access_only_read_only() {
        var _this = this;
        var _this1 = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(function() {
            var a;
            return _ts_generator(this, function(_state) {
                // call with element access
                _superprop_get("x").call(_this1);
                a = _superprop_get("x");
                // element access in arrow
                (function() {
                    return _superprop_get("x").call(_this1);
                });
                /*#__PURE__*/ // element access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get("x").call(_this1)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.element_access_only_write_only = function element_access_only_write_only() {
        var _this = this;
        var _superprop_update = function(_prop) {
            return {
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            };
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, true);
        };
        return _async_to_generator(function() {
            var f, ref;
            return _ts_generator(this, function(_state) {
                f = function() {};
                // element access (assign)
                _superprop_set("x", f);
                // destructuring assign with element access
                (ref = {
                    f: f
                }, _superprop_update("x")._ = ref.f, ref);
                // element access (assign) in arrow
                (function() {
                    return _superprop_set("x", f);
                });
                /*#__PURE__*/ // element access (assign) in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_set("x", f)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.property_access_only_read_only_in_generator = function property_access_only_read_only_in_generator() {
        var _this = this;
        var _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        };
        return _wrap_async_generator(function() {
            var a;
            return _ts_generator(this, function(_state) {
                // call with property access
                _superprop_get_x().call(_this1);
                a = _superprop_get_x();
                // property access in arrow
                (function() {
                    return _superprop_get_x().call(_this1);
                });
                /*#__PURE__*/ // property access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get_x().call(_this1)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.property_access_only_write_only_in_generator = function property_access_only_write_only_in_generator() {
        var _this = this;
        var _superprop_update_x = {
            get _ () {
                return _superprop_get_x();
            },
            set _ (v){
                _superprop_set_x(v);
            }
        }, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, true);
        };
        return _wrap_async_generator(function() {
            var f, ref;
            return _ts_generator(this, function(_state) {
                f = function() {};
                // property access (assign)
                _superprop_set_x(f);
                // destructuring assign with property access
                (ref = {
                    f: f
                }, _superprop_update_x._ = ref.f, ref);
                // property access (assign) in arrow
                (function() {
                    return _superprop_set_x(f);
                });
                /*#__PURE__*/ // property access (assign) in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_set_x(f)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.element_access_only_read_only_in_generator = function element_access_only_read_only_in_generator() {
        var _this = this;
        var _this1 = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _wrap_async_generator(function() {
            var a;
            return _ts_generator(this, function(_state) {
                // call with element access
                _superprop_get("x").call(_this1);
                a = _superprop_get("x");
                // element access in arrow
                (function() {
                    return _superprop_get("x").call(_this1);
                });
                /*#__PURE__*/ // element access in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_get("x").call(_this1)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    _proto.element_access_only_write_only_in_generator = function element_access_only_write_only_in_generator() {
        var _this = this;
        var _superprop_update = function(_prop) {
            return {
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            };
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, true);
        };
        return _wrap_async_generator(function() {
            var f, ref;
            return _ts_generator(this, function(_state) {
                f = function() {};
                // element access (assign)
                _superprop_set("x", f);
                // destructuring assign with element access
                (ref = {
                    f: f
                }, _superprop_update("x")._ = ref.f, ref);
                // element access (assign) in arrow
                (function() {
                    return _superprop_set("x", f);
                });
                /*#__PURE__*/ // element access (assign) in async arrow
                _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            _superprop_set("x", f)
                        ];
                    });
                });
                return [
                    2
                ];
            });
        })();
    };
    return B;
}(A);
