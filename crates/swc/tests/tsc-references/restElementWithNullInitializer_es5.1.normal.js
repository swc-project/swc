import * as swcHelpers from "@swc/helpers";
function foo1() {
    var ref = swcHelpers.toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null), r = ref.slice(0);
}
function foo2() {
    var ref = swcHelpers.toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : undefined), r = ref.slice(0);
}
function foo3() {
    var ref = swcHelpers.toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), r = ref.slice(0);
}
function foo4() {
    var ref = swcHelpers.toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []), r = ref.slice(0);
}
