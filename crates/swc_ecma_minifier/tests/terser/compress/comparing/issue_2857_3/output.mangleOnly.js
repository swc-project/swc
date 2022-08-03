function l(l, n) {
    l === undefined || (l === null && n);
    l === undefined || (l !== null && n);
    l !== undefined || (l === null && n);
    l !== undefined || (l !== null && n);
    l === undefined && l === null && n;
    l === undefined && l !== null && n;
    l !== undefined && l === null && n;
    l !== undefined && l !== null && n;
}
