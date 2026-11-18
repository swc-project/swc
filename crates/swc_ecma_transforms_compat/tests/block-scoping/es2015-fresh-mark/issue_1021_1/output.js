var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "m",
            value: function m() {
                var _this, _loop = function(x) {
                    console.log(_this, function(y) {
                        return y != x;
                    });
                };
                for(var x = 0; x < 10; x++)_this = this, _loop(x);
            }
        }
    ]);
    return C;
}();
