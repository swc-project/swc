//// [emitDefaultParametersFunctionProperty.ts]
var obj2 = {
    func1: function func1() {
        var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
    },
    func2: function func2() {
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    },
    func3: function func3(x, z) {
        var y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "hello";
    },
    func4: function func4(x, z) {
        var y = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "hello";
        for(var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
            rest[_key - 3] = arguments[_key];
        }
    }
};
