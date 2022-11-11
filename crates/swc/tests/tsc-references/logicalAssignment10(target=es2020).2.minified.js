//// [logicalAssignment10.ts]
var _obj, _incr, _oobj_obj, _incr1, count = 0, obj = {};
(_obj = obj)[_incr = ++count] ?? (_obj[_incr] = ++count), (_oobj_obj = ({
    obj
}).obj)[_incr1 = ++count] ?? (_oobj_obj[_incr1] = ++count);
