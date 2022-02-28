// @target: es6
class Base {
}
let tmp = (super(), "prop");
class C extends Base {
    [tmp]() {}
}
