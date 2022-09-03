//// [emitDefaultParametersFunctionProperty.ts]
var obj2 = {
    func1: function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        for(var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    },
    func2: function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    },
    func3: function(x, z) {
        arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    },
    func4: function(x, z) {
        arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        for(var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++)rest[_key - 3] = arguments[_key];
    }
};
