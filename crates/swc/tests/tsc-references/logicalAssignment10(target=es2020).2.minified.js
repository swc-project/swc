//// [logicalAssignment10.ts]
var _obj, _ref, _ref1, _ref2, count = 0, obj = {};
function incr() {
    return ++count;
}
(_obj = obj)[_ref = incr()], _obj[_ref] = incr(), (_ref1 = ({
    obj
}).obj)[_ref2 = incr()], _ref1[_ref2] = incr();
