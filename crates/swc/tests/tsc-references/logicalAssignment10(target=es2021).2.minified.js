//// [logicalAssignment10.ts]
var count = 0, obj = {};
const oobj = {
    obj
};
obj[++count] ??= ++count, oobj.obj[++count] ??= ++count;
