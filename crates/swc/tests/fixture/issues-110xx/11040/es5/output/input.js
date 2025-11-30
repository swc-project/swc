import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var aa, rest;
var src = {
    get aa () {
        console.log('getter aa (deleting zz)');
        delete this.zz;
        return 1;
    },
    yy: 2,
    zz: 3
};
aa = src.aa, rest = _object_without_properties(src, [
    "aa"
]), src;
console.log('rest keys:', Object.keys(rest));
