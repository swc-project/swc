var k = Symbol();
var _obj, _mutatorMap = {};
var foo = (_obj = {}, _define_property(_obj, Symbol.iterator, "foobar"), _mutatorMap[k] = _mutatorMap[k] || {}, _mutatorMap[k].get = function() {
    return k;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
