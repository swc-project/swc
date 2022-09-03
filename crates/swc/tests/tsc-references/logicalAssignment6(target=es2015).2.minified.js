//// [logicalAssignment6.ts]
function foo1(results, results1) {
    (results || (results = results1 || (results1 = []))).push(100);
}
function foo2(results, results1) {
    (null != results ? results : results = null != results1 ? results1 : results1 = []).push(100);
}
function foo3(results, results1) {
    (results && (results = results1 && (results1 = []))).push(100);
}
