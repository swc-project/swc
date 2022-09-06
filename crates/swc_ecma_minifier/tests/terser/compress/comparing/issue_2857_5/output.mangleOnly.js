function n(n, u) {
    (u && n === undefined) || n === null;
    (u && n === undefined) || n !== null;
    (u && n !== undefined) || n === null;
    (u && n !== undefined) || n !== null;
    u && n === undefined && n === null;
    u && n === undefined && n !== null;
    u && n !== undefined && n === null;
    u && n !== undefined && n !== null;
}
