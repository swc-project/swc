//// [mappedTypeAsClauseRelationships.ts]
function fun(val) {
    var x = val; // Ok
    var y = val; // Error
}
function fun2(val) {
    var x = val; // Ok
    var y = val; // Ok
    var z = val; // Error
    var w = val; // Error
}
