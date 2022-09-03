//// [twoAccessorsWithSameName.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
var _obj, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "x",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return _create_class(D, [
        {
            key: "x",
            set: function(v1) {}
        }
    ]), D;
}(), E = function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    return _create_class(E, [
        {
            key: "x",
            get: function() {
                return 1;
            },
            set: function(v1) {}
        }
    ]), E;
}(), _mutatorMap = {}, x = (_obj = {
    get x () {
        return 1;
    }
}, _mutatorMap.x = _mutatorMap.x || {}, _mutatorMap.x.get = function() {
    return 1;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj), y = {
    get x () {
        return 1;
    },
    set x (v){}
};
