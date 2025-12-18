//// [logicalAssignment10.ts]
var _obj, _incr, _, _oobj_obj, _incr1, _1;
var count = 0;
var obj = {};
function incr() {
    return ++count;
}
const oobj = {
    obj
};
(_ = (_obj = obj)[_incr = incr()]) !== null && _ !== void 0 ? _ : _obj[_incr] = incr();
(_1 = (_oobj_obj = oobj["obj"])[_incr1 = incr()]) !== null && _1 !== void 0 ? _1 : _oobj_obj[_incr1] = incr();
