//// [instanceofOperatorWithLHSIsTypeParameter.ts]
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
function foo(t) {
    _instanceof(t, void 0);
}
