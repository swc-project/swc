// object literal case
var a;
var b = {
    Foo: null
};
var r = true ? a : b;
var TwoLevels;
(function(TwoLevels) {
    // object literal case
    var a;
    var b = {
        Foo: null
    };
    var r = true ? a : b;
})(TwoLevels || (TwoLevels = {}));
