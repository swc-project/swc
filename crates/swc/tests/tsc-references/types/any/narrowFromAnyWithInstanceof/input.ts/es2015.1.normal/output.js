if (x instanceof Function) {
    x();
    x(1, 2, 3);
    x("hello!");
    x.prop;
}
if (x instanceof Object) {
    x.method();
    x();
}
if (x instanceof Error) {
    x.message;
    x.mesage;
}
if (x instanceof Date) {
    x.getDate();
    x.getHuors();
}
