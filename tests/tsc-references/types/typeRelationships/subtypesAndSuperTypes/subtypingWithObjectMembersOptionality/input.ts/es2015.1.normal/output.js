// object literal case
var a1;
var b1 = {
    Foo: null
};
var r = true ? a1 : b1;
var TwoLevels;
(function(TwoLevels) {
    // object literal case
    var a;
    var b = {
        Foo: null
    };
    var r = true ? a : b;
})(TwoLevels || (TwoLevels = {
}));
