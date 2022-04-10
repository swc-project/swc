import * as swcHelpers from "@swc/helpers";
import foo from "./b";
import Foo from "./a";
var Foo = function Foo() {
    swcHelpers.classCallCheck(this, Foo);
};
foo();
export default function foo() {
    new Foo();
};
import("./a");
export { Foo as default };
