import * as swcHelpers from "@swc/helpers";
if (swcHelpers._instanceof(x, Function)) {
    x();
    x(1, 2, 3);
    x("hello!");
    x.prop;
}
if (swcHelpers._instanceof(x, Object)) {
    x.method();
    x();
}
if (swcHelpers._instanceof(x, Error)) {
    x.message;
    x.mesage;
}
if (swcHelpers._instanceof(x, Date)) {
    x.getDate();
    x.getHuors();
}
