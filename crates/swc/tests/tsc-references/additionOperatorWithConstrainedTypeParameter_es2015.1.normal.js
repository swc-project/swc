// test for #17069
function sum(n, v, k) {
    n = n + v[k];
    n += v[k]; // += should work the same way
}
function realSum(n, vs, k) {
    for (const v of vs){
        n = n + v[k];
        n += v[k];
    }
}
