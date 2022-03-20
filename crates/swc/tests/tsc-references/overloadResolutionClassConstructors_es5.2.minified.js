import * as swcHelpers from "@swc/helpers";
var SomeBase = function() {
    "use strict";
    swcHelpers.classCallCheck(this, SomeBase);
}, SomeDerived1 = function(SomeBase1) {
    "use strict";
    swcHelpers.inherits(SomeDerived1, SomeBase1);
    var _super = swcHelpers.createSuper(SomeDerived1);
    function SomeDerived1() {
        return swcHelpers.classCallCheck(this, SomeDerived1), _super.apply(this, arguments);
    }
    return SomeDerived1;
}(SomeBase), SomeDerived2 = function(SomeBase2) {
    "use strict";
    swcHelpers.inherits(SomeDerived2, SomeBase2);
    var _super = swcHelpers.createSuper(SomeDerived2);
    function SomeDerived2() {
        return swcHelpers.classCallCheck(this, SomeDerived2), _super.apply(this, arguments);
    }
    return SomeDerived2;
}(SomeBase), SomeDerived3 = function(SomeBase3) {
    "use strict";
    swcHelpers.inherits(SomeDerived3, SomeBase3);
    var _super = swcHelpers.createSuper(SomeDerived3);
    function SomeDerived3() {
        return swcHelpers.classCallCheck(this, SomeDerived3), _super.apply(this, arguments);
    }
    return SomeDerived3;
}(SomeBase), fn1 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, fn1);
};
new fn1(void 0), new fn1({});
var fn2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, fn2);
};
new fn2(0, void 0), new fn2(0, ""), new fn2("", 0), new fn2("", 0);
var fn3 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, fn3);
};
new fn3(3), new fn3("", 3, ""), new fn3(5, 5, 5), new fn3(4), new fn3("", "", ""), new fn3("", "", 3), new fn3();
var fn4 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, fn4);
};
new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4(3, void 0), new fn4("", null), new fn4(null, null), new fn4(!0, null), new fn4(null, !0);
var fn5 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, fn5);
};
new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
}), new fn5(function(n) {
    return n.blah;
});
