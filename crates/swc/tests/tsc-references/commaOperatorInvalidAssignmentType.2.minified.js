//// [commaOperatorInvalidAssignmentType.ts]
var BOOLEAN, NUMBER, STRING, resultIsBoolean, resultIsNumber, resultIsString;
resultIsBoolean = STRING, resultIsBoolean = NUMBER, resultIsNumber = BOOLEAN, resultIsNumber = STRING, resultIsString = BOOLEAN, resultIsString = NUMBER;
