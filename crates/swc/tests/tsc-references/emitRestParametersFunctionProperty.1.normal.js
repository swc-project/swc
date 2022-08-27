//// [emitRestParametersFunctionProperty.ts]
var obj;
var obj2 = {
    func: function func() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
    }
};
