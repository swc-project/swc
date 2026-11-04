import { _ as _type_of } from "@swc/helpers/_/_type_of";
export function f() {
    return [
        ("u" < typeof a ? "undefined" : _type_of(a)) === 'object',
        ("u" < typeof b ? "undefined" : _type_of(b)) === 'symbol',
        "u" < typeof c ? "undefined" : _type_of(c)
    ];
}
