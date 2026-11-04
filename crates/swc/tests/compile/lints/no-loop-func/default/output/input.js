var _object_without_properties = require("@swc/helpers/_/_object_without_properties");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
var _loop = function(i1) {
    var x = function x() {
        alert(i1);
    };
    x();
};
// Not in loop case. It's ok for this rule
var v = 10;
function foo() {
    console.log(v);
}
// it's unsafe
for(var i = 0; i < 10; i += 1){
    var x = function x() {
        alert(i);
    };
    x();
}
// it's safe
for(var i1 = 0; i1 < 10; i1 += 1)_loop(i1);
// Not ok, because 'z' declared out of loop
var z = 10;
var zz = 20;
for(var i2 = 0; i2 < 10; i2 += 1){
    var x = function x() {
        alert(z, zz);
    };
    x();
}
// Not ok
var a;
for(var i3 in {}){
    (function() {
        a;
    });
    a = 1;
}
// interview example =)
for(var i = 0; i < 10; i++){
    setTimeout(function() {
        console.log(i);
    });
}
// it's ok
while(cond){
    var ee = function ee() {
        alert(x1);
    };
    var x1 = 10;
}
// not ok
while(true){
    var a = 0;
    while(true){
        setTimeout(function() {
            a;
        });
    }
}
var aa = obj.aa, bb = obj.bb.bb, _obj_cc = _sliced_to_array._(obj.cc, 1), cc = _obj_cc[0], ee1 = _object_without_properties._(obj, [
    "aa",
    "bb",
    "cc"
]);
for(var k in obj){
    setTimeout(function() {
        aa;
        bb;
        cc;
        ee1;
    });
}
