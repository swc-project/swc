function fn() {}
var args = [
    1,
    2,
    3
];
var obj = {
    obj: {
        fn
    }
};
switch(true){
    case true:
        var _obj_obj;
        (_obj_obj = obj.obj).fn.apply(_obj_obj, _to_consumable_array(args));
        break;
}
