//// [controlFlowAliasingCatchVariables.ts]
try {} catch (e) {
    var isString = typeof e === 'string';
    if (isString) {
        e.toUpperCase(); // e string
    }
    if (typeof e === 'string') {
        e.toUpperCase(); // e string
    }
}
try {} catch (e) {
    var isString1 = typeof e === 'string';
    e = 1;
    if (isString1) {
        e.toUpperCase(); // e any/unknown
    }
    if (typeof e === 'string') {
        e.toUpperCase(); // e string
    }
}
