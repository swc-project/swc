import * as swcHelpers from "@swc/helpers";
var NoBase = function() {
    "use strict";
    function NoBase() {
        swcHelpers.classCallCheck(this, NoBase), this.m = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this), this.n = swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, ""), swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this), swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, "");
    }
    return swcHelpers.createClass(NoBase, [
        {
            key: "fn",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "prototype", this), swcHelpers.get(swcHelpers.getPrototypeOf(NoBase.prototype), "hasOwnProperty", this).call(this, "");
            }
        }
    ], [
        {
            key: "static1",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, "");
            }
        },
        {
            key: "static2",
            get: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, ""), "";
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(NoBase), "hasOwnProperty", this).call(this, "");
            }
        }
    ]), NoBase;
}(), SomeBase = function() {
    "use strict";
    function SomeBase() {
        swcHelpers.classCallCheck(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    return swcHelpers.createClass(SomeBase, [
        {
            key: "privateFunc",
            value: function() {}
        },
        {
            key: "publicFunc",
            value: function() {}
        }
    ], [
        {
            key: "privateStaticFunc",
            value: function() {}
        },
        {
            key: "publicStaticFunc",
            value: function() {}
        }
    ]), SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0;
var SomeDerived1 = function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived1, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        swcHelpers.classCallCheck(this, SomeDerived1);
        var _this = _super.call(this);
        return swcHelpers.set((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerived1.prototype)), "publicMember", 1, _this, !0), _this;
    }
    return swcHelpers.createClass(SomeDerived1, [
        {
            key: "fn",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "a",
            get: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived1.prototype), "publicMember", this);
            }
        },
        {
            key: "fn2",
            value: function() {}
        }
    ]), SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived2, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        swcHelpers.classCallCheck(this, SomeDerived2);
        var _this = _super.call(this);
        return swcHelpers.set((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(SomeDerived2.prototype)), "privateMember", 1, _this, !0), _this;
    }
    return swcHelpers.createClass(SomeDerived2, [
        {
            key: "fn",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        },
        {
            key: "a",
            get: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            },
            set: function(n) {
                swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived2.prototype), "privateMember", this);
            }
        }
    ]), SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase) {
    "use strict";
    swcHelpers.inherits(SomeDerived3, SomeBase);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        return swcHelpers.classCallCheck(this, SomeDerived3), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(SomeDerived3, null, [
        {
            key: "fn",
            value: function() {
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        },
        {
            key: "a",
            get: function() {
                return swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this), "";
            },
            set: function(n) {
                swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "publicStaticMember", 3, this, !0), swcHelpers.set(swcHelpers.getPrototypeOf(SomeDerived3.prototype), "privateStaticMember", 3, this, !0), swcHelpers.get(swcHelpers.getPrototypeOf(SomeDerived3), "privateStaticFunc", this).call(this);
            }
        }
    ]), SomeDerived3;
}(SomeBase);
super.wat, super.foo();
