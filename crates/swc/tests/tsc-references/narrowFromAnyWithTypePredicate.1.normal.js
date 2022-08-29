//// [narrowFromAnyWithTypePredicate.ts]
if (isFunction(x)) {
    x();
    x(1, 2, 3);
    x("hello!");
    x.prop;
}
if (isObject(x)) {
    x.method();
    x();
}
if (isAnything(x)) {
    x.method();
    x();
}
if (isError(x)) {
    x.message;
    x.mesage;
}
if (isDate(x)) {
    x.getDate();
    x.getHuors();
}
