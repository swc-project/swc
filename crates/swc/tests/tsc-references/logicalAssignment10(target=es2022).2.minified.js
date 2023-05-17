//// [logicalAssignment10.ts]
var count = 0, obj = {};
obj[++count] ??= ++count, ({
    obj
}).obj[++count] ??= ++count;
