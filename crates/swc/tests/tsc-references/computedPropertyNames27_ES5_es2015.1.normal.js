// @target: es5
class Base {
}
var tmp = (super(), "prop");
class C extends Base {
    [tmp]() {
    }
}
