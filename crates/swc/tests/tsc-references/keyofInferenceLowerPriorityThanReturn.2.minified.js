//// [keyofInferenceLowerPriorityThanReturn.ts]
var bookTable = null;
function insertOnConflictDoNothing(_table, _conflictTarget) {
    throw Error();
}
function f() {
    insertOnConflictDoNothing(bookTable, ConflictTarget.tableColumns([
        "serial"
    ]));
}
