//// [overloadResolutionConstructors.ts]
var fn1, fn2, fn3, fn4, fn5;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
new fn1(void 0), new fn1({}), new fn2(0, void 0), new fn2(0, ''), new fn2('', 0), new fn2('', 0), new fn3(3), new fn3('', 3, ''), new fn3(5, 5, 5), new fn3(4), new fn3('', '', ''), new fn3('', '', 3), new fn3(), new fn4('', 3), new fn4(3, ''), new fn4('', 3), new fn4(3, ''), new fn4('', 3), new fn4(3, ''), new fn4(3, void 0), new fn4('', null), new fn4(null, null), new fn4(!0, null), new fn4(null, !0), new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
});
