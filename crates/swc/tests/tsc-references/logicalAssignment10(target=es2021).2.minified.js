//// [logicalAssignment10.ts]
var count = 0, obj = {};
function incr() {
    return ++count;
}
const oobj = {
    obj
};
obj[incr()] ??= incr(), oobj.obj[incr()] ??= incr();
