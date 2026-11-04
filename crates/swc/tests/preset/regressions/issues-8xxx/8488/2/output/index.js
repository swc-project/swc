function f1() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
}
function f2() {
    var _this = this;
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return _this;
    };
}
function f3() {
    var _this = this;
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return _this;
    };
}
function bar() {
    function b1() {
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    }
    function b2() {
        var _this = this;
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
            return _this;
        };
    }
    function b3() {
        var _this = this;
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
            return _this;
        };
    }
}
