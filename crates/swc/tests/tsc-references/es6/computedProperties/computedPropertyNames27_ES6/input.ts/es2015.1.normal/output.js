// @target: es6
class Base {
}
var tmp = (super(), "prop");
class C extends Base {
    [tmp]() {
    }
}
