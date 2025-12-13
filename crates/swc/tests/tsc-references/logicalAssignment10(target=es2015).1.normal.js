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
var _;
(_ = (_obj = obj)[_incr = incr()]) !== null && _ !== void 0 ? _ : _obj[_incr] = incr();
var _oobj_obj;
var _incr1;
var _1;
(_1 = (_oobj_obj = oobj["obj"])[_incr1 = incr()]) !== null && _1 !== void 0 ? _1 : _oobj_obj[_incr1] = incr();
