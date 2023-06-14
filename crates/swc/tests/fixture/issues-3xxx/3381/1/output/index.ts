var dummyTsFunction = function() {
    var dummyArray = [
        0,
        1,
        2
    ];
    var func1 = function(array) {
        var // Mapping array
        _array_map, _this;
        return (_this = array) === null || _this === void 0 ? void 0 : (_array_map = _this.map) === null || _array_map === void 0 ? void 0 : _array_map.call(_this, function(i) {
            return i;
        });
    };
    var func2 = function(array) {
        var _array_map, _this;
        return (_this = array) === null || _this === void 0 ? void 0 : (_array_map = _this.map) === null || _array_map === void 0 ? void 0 : _array_map.call(_this, function(i) {
            return i;
        });
    };
    console.log(func1(dummyArray)); // output: undefined
    console.log(func2(dummyArray)); // output: array
};
