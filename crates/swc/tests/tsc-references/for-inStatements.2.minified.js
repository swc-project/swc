//// [for-inStatements.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
for(var x in (M || (M = {})).X = function X() {
    _class_call_check(this, X);
}, M);
for(var x in M.X);
var aString, anAny, c, d, e, i, M, Color, Color1 = ((Color = Color1 || {})[Color.Red = 0] = "Red", Color[Color.Blue = 1] = "Blue", Color);
for(var x in Color1);
for(var x in 1);
