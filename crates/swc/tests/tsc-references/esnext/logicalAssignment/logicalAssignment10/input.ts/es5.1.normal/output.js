var _obj, _ref;
// @target: esnext, es2020, es2015
var count = 0;
var obj = {
};
function incr() {
    return ++count;
}
var oobj = {
    obj: obj
};
var ref;
(ref = (_obj = obj)[incr()]) !== null && ref !== void 0 ? ref : _obj[incr()] = incr();
var ref1;
(ref1 = (_ref = oobj["obj"])[incr()]) !== null && ref1 !== void 0 ? ref1 : _ref[incr()] = incr();
