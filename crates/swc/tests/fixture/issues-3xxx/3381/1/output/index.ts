var dummyTsFunction = function() {
    var dummyArray = [
        0,
        1,
        2
    ];
    var func1 = function(array) {
        var // Mapping array
        _array;
        return (_array = array) === null || _array === void 0 ? void 0 : _array.map(function(i) {
            return i;
        });
    };
    var func2 = function(array) {
        var _array;
        return (_array = array) === null || _array === void 0 ? void 0 : _array.map(function(i) {
            return i;
        });
    };
    console.log(func1(dummyArray)); // output: undefined
    console.log(func2(dummyArray)); // output: array
};
