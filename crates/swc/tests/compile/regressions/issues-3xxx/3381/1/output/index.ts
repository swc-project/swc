var dummyTsFunction = function dummyTsFunction() {
    var dummyArray = [
        0,
        1,
        2
    ];
    var func1 = function func1(array) {
        return(// Mapping array
        array === null || array === void 0 ? void 0 : array.map(function(i) {
            return i;
        }));
    };
    var func2 = function func2(array) {
        return array === null || array === void 0 ? void 0 : array.map(function(i) {
            return i;
        });
    };
    console.log(func1(dummyArray)); // output: undefined
    console.log(func2(dummyArray)); // output: array
};
