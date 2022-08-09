// @strict: true
if (q.a !== undefined) {
    q.a.aProp;
} else {
    // q.b is previously incorrectly inferred as potentially undefined
    q.b.bProp;
}
