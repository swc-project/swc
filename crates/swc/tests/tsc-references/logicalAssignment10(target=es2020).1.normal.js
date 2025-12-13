//// [logicalAssignment10.ts]
var count = 0;
var obj = {};
function incr() {
    return ++count;
}
const oobj = {
    obj
};
var _obj;
var _incr;
(_obj = obj)[_incr = incr()] ?? (_obj[_incr] = incr());
var _oobj_obj;
var _incr1;
(_oobj_obj = oobj["obj"])[_incr1 = incr()] ?? (_oobj_obj[_incr1] = incr());
