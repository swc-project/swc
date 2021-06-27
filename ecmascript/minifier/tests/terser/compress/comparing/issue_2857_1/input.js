function f1(a) {
    a === undefined || a === null;
    a === undefined || a !== null;
    a !== undefined || a === null;
    a !== undefined || a !== null;
    a === undefined && a === null;
    a === undefined && a !== null;
    a !== undefined && a === null;
    a !== undefined && a !== null;
}
function f2(a) {
    a === null || a === undefined;
    a === null || a !== undefined;
    a !== null || a === undefined;
    a !== null || a !== undefined;
    a === null && a === undefined;
    a === null && a !== undefined;
    a !== null && a === undefined;
    a !== null && a !== undefined;
}
