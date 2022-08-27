//// [propertyAccessWidening.ts]
// Repro from #31762
function g1(headerNames) {
    var t = [
        {
            hasLineBreak: false,
            cells: []
        }
    ];
    var table = [
        {
            cells: headerNames
        }
    ].concat(t);
}
function g2(headerNames) {
    var t = [
        {
            hasLineBreak: false,
            cells: []
        }
    ];
    var table = [
        {
            cells: headerNames
        }
    ]["concat"](t);
}
// Object in property or element access is widened when target of assignment
function foo(options) {
    var x1 = (options || {}).a; // Object type not widened
    var x2 = (options || {})["a"]; // Object type not widened
    (options || {}).a = 1; // Object type widened, error
    (options || {})["a"] = 1; // Object type widened, error
}
