var _obj, _ref, ref, ref1, count = 0, obj = {};
function incr() {
    return ++count;
}
null !== (ref = (_obj = obj)[incr()]) && void 0 !== ref || (_obj[incr()] = incr()), null !== (ref1 = (_ref = obj)[incr()]) && void 0 !== ref1 || (_ref[incr()] = incr());
