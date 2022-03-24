try {} catch (e) {
    const isString = 'string' == typeof e;
    isString && e.toUpperCase(), 'string' == typeof e && e.toUpperCase();
}
try {} catch (e1) {
    const isString = 'string' == typeof e1;
    e1 = 1, isString && e1.toUpperCase(), 'string' == typeof e1 && e1.toUpperCase();
}
