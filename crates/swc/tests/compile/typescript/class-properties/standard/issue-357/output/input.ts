export function addProp(arg1, arg2, arg3) {
    if (arguments.length === 2) {
        return (object)=>_addProp(object, arg1, arg2);
    }
    return _addProp(arg1, arg2, arg3);
}
function _addProp(obj, prop, value) {
    return {
        ...obj,
        [prop]: value
    };
}
