//// [logicalAssignment8.ts]
function foo1(results) {
    (results ||= bar?.value ?? []).push(100);
}
function foo2(results) {
    (results ??= bar?.value ?? []).push(100);
}
function foo3(results) {
    (results &&= bar?.value ?? []).push(100);
}
