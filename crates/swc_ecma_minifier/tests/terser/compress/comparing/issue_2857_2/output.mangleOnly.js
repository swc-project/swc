function a(a, b) {
    a === undefined || a === null || b;
    a === undefined || a !== null || b;
    a !== undefined || a === null || b;
    a !== undefined || a !== null || b;
    (a === undefined && a === null) || b;
    (a === undefined && a !== null) || b;
    (a !== undefined && a === null) || b;
    (a !== undefined && a !== null) || b;
}
