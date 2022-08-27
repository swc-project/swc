//// [subtypingWithObjectMembersOptionality.ts]
// Derived member is not optional but base member is, should be ok
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
