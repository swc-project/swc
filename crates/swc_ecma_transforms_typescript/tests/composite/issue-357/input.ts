export function addProp<T, K extends string, V>(
    obj: T,
    prop: K,
    value: V
): T & { [x in K]: V };
export function addProp<T, K extends string, V>(
    prop: K,
    value: V
): (obj: T) => T & { [x in K]: V };

export function addProp(arg1: any, arg2: any, arg3?: any): any {
    if (arguments.length === 2) {
        return (object: any) => _addProp(object, arg1, arg2);
    }
    return _addProp(arg1, arg2, arg3);
}

function _addProp(obj: any, prop: string, value: any) {
    return {
        ...obj,
        [prop]: value,
    };
}