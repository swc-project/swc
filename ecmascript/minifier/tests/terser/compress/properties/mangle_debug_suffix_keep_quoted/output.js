var a = {};
a._$top$XYZ_ = 1;
function f1() {
    a["foo"] = "bar";
    a.color = "red";
    a._$stuff$XYZ_ = 2;
    x = { bar: 10, _$size$XYZ_: 7 };
    a._$size$XYZ_ = 9;
}
function f2() {
    a.foo = "bar";
    a["color"] = "red";
    x = { bar: 10, _$size$XYZ_: 7 };
    a._$size$XYZ_ = 9;
    a._$stuff$XYZ_ = 3;
}
