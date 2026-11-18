import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref;
let aa, rest;
const src = {
    get aa () {
        console.log('getter aa (deleting zz)');
        delete this.zz;
        return 1;
    },
    yy: 2,
    zz: 3
};
_ref = src, ({ aa } = _ref), rest = _object_without_properties(_ref, [
    "aa"
]), _ref;
console.log('rest keys:', Object.keys(rest));
