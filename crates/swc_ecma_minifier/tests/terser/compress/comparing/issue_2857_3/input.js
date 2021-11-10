function f(a, p) {
    a === undefined || (a === null && p);
    a === undefined || (a !== null && p);
    a !== undefined || (a === null && p);
    a !== undefined || (a !== null && p);
    a === undefined && a === null && p;
    a === undefined && a !== null && p;
    a !== undefined && a === null && p;
    a !== undefined && a !== null && p;
}
