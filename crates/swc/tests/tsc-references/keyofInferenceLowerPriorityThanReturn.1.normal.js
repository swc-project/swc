//// [keyofInferenceLowerPriorityThanReturn.ts]
// #22736
var bookTable = null;
function insertOnConflictDoNothing(_table, _conflictTarget) {
    throw new Error();
}
function f() {
    insertOnConflictDoNothing(bookTable, ConflictTarget.tableColumns([
        "serial"
    ])); // <-- No error here; should use the type inferred for the return type of `tableColumns`
}
