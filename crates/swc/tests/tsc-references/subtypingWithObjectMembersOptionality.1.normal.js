//// [subtypingWithObjectMembersOptionality.ts]
// object literal case
var a;
var b = {
    Foo: null
};
var r = true ? a : b;
(function(TwoLevels) {
    // object literal case
    var a;
    var b = {
        Foo: null
    };
    var r = true ? a : b;
})(TwoLevels || (TwoLevels = {}));
var TwoLevels;
