//// [logicalAssignment7.ts]
function foo1(results, results1) {
    (results ||= results1 ||= []).push(100);
}
function foo2(results, results1) {
    (results ??= results1 ??= []).push(100);
}
function foo3(results, results1) {
    (results &&= results1 &&= []).push(100);
}
