//// [logicalAssignment10.ts]
var _obj, _incr, _oobj_obj, _incr1;
var count = 0;
var obj = {};
function incr() {
    return ++count;
}
const oobj = {
    obj
};
(_obj = obj)[_incr = incr()] ?? (_obj[_incr] = incr());
(_oobj_obj = oobj["obj"])[_incr1 = incr()] ?? (_oobj_obj[_incr1] = incr());
