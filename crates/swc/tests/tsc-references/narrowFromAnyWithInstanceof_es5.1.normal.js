import _instanceof from "@swc/helpers/src/_instanceof.mjs";
if (_instanceof(x, Function)) {
    x();
    x(1, 2, 3);
    x("hello!");
    x.prop;
}
if (_instanceof(x, Object)) {
    x.method();
    x();
}
if (_instanceof(x, Error)) {
    x.message;
    x.mesage;
}
if (_instanceof(x, Date)) {
    x.getDate();
    x.getHuors();
}
