function l(l, n) {
    n || l === undefined || l === null;
    n || l === undefined || l !== null;
    n || l !== undefined || l === null;
    n || l !== undefined || l !== null;
    n || (l === undefined && l === null);
    n || (l === undefined && l !== null);
    n || (l !== undefined && l === null);
    n || (l !== undefined && l !== null);
}
