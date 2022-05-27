function a(a) {
    a === undefined || a === null;
    a === undefined || a !== null;
    a !== undefined || a === null;
    a !== undefined || a !== null;
    a === undefined && a === null;
    a === undefined && a !== null;
    a !== undefined && a === null;
    a !== undefined && a !== null;
}
function b(a) {
    a === null || a === undefined;
    a === null || a !== undefined;
    a !== null || a === undefined;
    a !== null || a !== undefined;
    a === null && a === undefined;
    a === null && a !== undefined;
    a !== null && a === undefined;
    a !== null && a !== undefined;
}
