try {} catch (e) {
    "string" == typeof e && e.toUpperCase(), "string" == typeof e && e.toUpperCase();
}
try {} catch (e1) {
    var isString = "string" == typeof e1;
    e1 = 1, isString && e1.toUpperCase(), "string" == typeof e1 && e1.toUpperCase();
}
