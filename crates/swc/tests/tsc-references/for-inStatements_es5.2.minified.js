var aString, anAny, c, d, e, i, M, Color;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
for(aString in {});
for(anAny in {});
for(var x in {});
for(var x in []);
for(var x in [
    1,
    2,
    3,
    4,
    5
]);
function fn() {}
for(var x in fn());
for(var x in /[a-z]/);
for(var x in new Date());
for(var x in c || d);
for(var x in e ? c : d);
for(var x in c);
for(var x in d);
for(var x in d[x]);
for(var x in c[d]);
for(var x in function(x) {
    return x;
});
for(var x in function(x, y) {
    return x + y;
});
for(var x in i[42]);
for(var x in !function(M) {
    var X = function X() {
        "use strict";
        _class_call_check(this, X);
    };
    M.X = X;
}(M || (M = {})), M);
for(var x in M.X);
for(var x in !function(Color) {
    Color[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue";
}(Color || (Color = {})), Color);
for(var x in Color.Blue);
