import * as swcHelpers from "@swc/helpers";
var x, y, Base = function() {
    "use strict";
    function Base(a) {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "b",
            value: function(a) {}
        },
        {
            key: "c",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "s",
            value: function(a) {}
        },
        {
            key: "t",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        return swcHelpers.classCallCheck(this, Derived), _super.call(this, x);
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "b",
            value: function(a) {}
        },
        {
            key: "c",
            get: function() {
                return y;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "s",
            value: function(a) {}
        },
        {
            key: "t",
            get: function() {
                return y;
            },
            set: function(a) {}
        }
    ]), Derived;
}(Base);
