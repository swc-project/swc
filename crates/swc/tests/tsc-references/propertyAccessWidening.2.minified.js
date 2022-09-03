//// [propertyAccessWidening.ts]
function g1(headerNames) {
    [
        {
            cells: headerNames
        }
    ].concat([
        {
            hasLineBreak: !1,
            cells: []
        }
    ]);
}
function g2(headerNames) {
    [
        {
            cells: headerNames
        }
    ].concat([
        {
            hasLineBreak: !1,
            cells: []
        }
    ]);
}
function foo(options) {
    (options || {}).a, (options || {}).a, (options || {}).a = 1, (options || {}).a = 1;
}
