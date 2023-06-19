var dummyTsFunction = function() {
    var dummyArray = [
        0,
        1,
        2
    ];
    var func1 = function(array) {
        return(// Mapping array
        array?.map(function(i) {
            return i;
        }));
    };
    var func2 = function(array) {
        return array?.map(function(i) {
            return i;
        });
    };
    console.log(func1(dummyArray)); // output: undefined
    console.log(func2(dummyArray)); // output: array
};
