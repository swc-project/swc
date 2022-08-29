//// [assignmentCompatBetweenTupleAndArray.ts]
var numStrTuple;
var numNumTuple;
var numEmptyObjTuple;
var emptyObjTuple;
var numArray;
var emptyObjArray;
// no error
numArray = numNumTuple;
emptyObjArray = emptyObjTuple;
emptyObjArray = numStrTuple;
emptyObjArray = numNumTuple;
emptyObjArray = numEmptyObjTuple;
// error
numArray = numStrTuple;
emptyObjTuple = emptyObjArray;
