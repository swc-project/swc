const obj = {
    foo () {
        var _obj, _mutatorMap = {};
        const obj2 = (_obj = {}, _mutatorMap[1] = _mutatorMap[1] || {}, _mutatorMap[1].get = function() {
            return 42;
        }, _define_enumerable_properties(_obj, _mutatorMap), _obj);
        return obj2;
    }
};
