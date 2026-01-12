var Sub = function Sub() {
    "use strict";
    _class_call_check(this, Sub);
};
var Test = /*#__PURE__*/ function(Sub) {
    "use strict";
    _inherits(Test, Sub);
    function Test() {
        _class_call_check(this, Test);
        var _this;
        var _this1;
        _this = _call_super(this, Test, arguments), _this1 = _this, _define_property(_this, "isWaitContentRender", false), _define_property(_this, "renderOverlay", async function() {
            (function() {
                console.log(_this1, "__123___");
            })();
        });
        return _this;
    }
    return Test;
}(Sub);
var test = new Test();
var render = test.renderOverlay;
render();
