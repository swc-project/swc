import { _ as _type_of } from "@swc/helpers/_/_type_of";
export function f() {
    return [
        ("undefined" == typeof a ? "undefined" : _type_of(a)) === 'object',
        ("undefined" == typeof b ? "undefined" : _type_of(b)) === 'symbol',
        "undefined" == typeof c ? "undefined" : _type_of(c)
    ];
}
