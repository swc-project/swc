import * as swcHelpers from "@swc/helpers";
var SomeClass = swcHelpers.decorate([], function(_initialize) {
    var SomeClass = function SomeClass() {
        "use strict";
        swcHelpers.classCallCheck(this, SomeClass);
        _initialize(this);
    };
    return {
        F: SomeClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "someMethod",
                value: function someMethod() {}
            }
        ]
    };
});
var OtherClass = swcHelpers.decorate([], function(_initialize, _SomeClass1) {
    var OtherClass = /*#__PURE__*/ function(_SomeClass) {
        "use strict";
        swcHelpers.inherits(OtherClass, _SomeClass);
        var _super = swcHelpers.createSuper(OtherClass);
        function OtherClass() {
            swcHelpers.classCallCheck(this, OtherClass);
            var _this;
            _this = _super.apply(this, arguments);
            _initialize(swcHelpers.assertThisInitialized(_this));
            return _this;
        }
        return OtherClass;
    }(_SomeClass1);
    return {
        F: OtherClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "anotherMethod",
                value: function anotherMethod() {
                    swcHelpers.get(swcHelpers.getPrototypeOf(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
