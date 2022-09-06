//// [asyncMethodWithSuper_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
!function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.simple = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return _superprop_get_x().call(_this1), _get(_get_prototype_of(B.prototype), "y", _this).call(_this1), _superprop_get("x").call(_this1), _superprop_get_x(), _superprop_get("x"), [
                    2
                ];
            });
        })();
    }, _proto.advanced = function() {
        var _this = this, _this1 = this, _superprop_update_x = {
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
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, !0);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, !0);
        };
        return _async_to_generator(function() {
            var f, ref, ref1;
            return _ts_generator(this, function(_state) {
                return f = function() {}, _superprop_get_x().call(_this1), _superprop_get("x").call(_this1), _superprop_get_x(), _superprop_get("x"), _superprop_set_x(f), _superprop_set("x", f), ref = {
                    f: f
                }, _superprop_update_x._ = ref.f, ref1 = {
                    f: f
                }, _superprop_update("x")._ = ref1.f, [
                    2
                ];
            });
        })();
    }, B;
}(function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    return _proto.x = function() {}, _proto.y = function() {}, A;
}());
