//// [controlFlowAliasingCatchVariables.ts]
try {} catch (e) {
    'string' == typeof e && e.toUpperCase(), 'string' == typeof e && e.toUpperCase();
}
try {} catch (e) {
    var isString1 = 'string' == typeof e;
    e = 1, isString1 && e.toUpperCase(), 'string' == typeof e && e.toUpperCase();
}
