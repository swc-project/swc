var _obj, _mutatorMap = {};
var obj = (_obj = {}, _mutatorMap[foobar] = _mutatorMap[foobar] || {}, _mutatorMap[foobar].get = function() {
    return "foobar";
}, _mutatorMap[foobar] = _mutatorMap[foobar] || {}, _mutatorMap[foobar].set = function(x) {
    console.log(x);
}, _mutatorMap["test"] = _mutatorMap["test"] || {}, _mutatorMap["test"].get = function() {
    return "regular getter after computed property";
}, _mutatorMap["test"] = _mutatorMap["test"] || {}, _mutatorMap["test"].set = function(x) {
    console.log(x);
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
