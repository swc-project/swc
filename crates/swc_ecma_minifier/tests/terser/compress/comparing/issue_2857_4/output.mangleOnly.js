function a(a, b) {
    b || a === undefined || a === null;
    b || a === undefined || a !== null;
    b || a !== undefined || a === null;
    b || a !== undefined || a !== null;
    b || (a === undefined && a === null);
    b || (a === undefined && a !== null);
    b || (a !== undefined && a === null);
    b || (a !== undefined && a !== null);
}
