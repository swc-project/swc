// @target: esnext, es2021, es2020, es2015
var _obj, _ref, _ref1, _ref2;
var count = 0;
var obj = {};
function incr() {
    return ++count;
}
const oobj = {
    obj
};
var ref;
(ref = (_obj = obj)[_ref = incr()]) !== null && ref !== void 0 ? ref : _obj[_ref] = incr();
var ref1;
(ref1 = (_ref1 = oobj["obj"])[_ref2 = incr()]) !== null && ref1 !== void 0 ? ref1 : _ref1[_ref2] = incr();
