function n(n, u) {
    n === undefined || n === null || u;
    n === undefined || n !== null || u;
    n !== undefined || n === null || u;
    n !== undefined || n !== null || u;
    (n === undefined && n === null) || u;
    (n === undefined && n !== null) || u;
    (n !== undefined && n === null) || u;
    (n !== undefined && n !== null) || u;
}
