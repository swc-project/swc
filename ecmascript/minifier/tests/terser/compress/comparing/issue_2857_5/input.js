function f(a, p) {
    (p && a === undefined) || a === null;
    (p && a === undefined) || a !== null;
    (p && a !== undefined) || a === null;
    (p && a !== undefined) || a !== null;
    p && a === undefined && a === null;
    p && a === undefined && a !== null;
    p && a !== undefined && a === null;
    p && a !== undefined && a !== null;
}
