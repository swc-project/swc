// @target: es5
var obj2 = {
    func1: function(param) {
        var y = param === void 0 ? 10 : param;
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
    },
    func2: function(param) {
        var x = param === void 0 ? "hello" : param;
    },
    func3: function(x, z, param) {
        var y = param === void 0 ? "hello" : param;
    },
    func4: function(x, z, param) {
        var y = param === void 0 ? "hello" : param;
        for(var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
            rest[_key - 3] = arguments[_key];
        }
    }
};
