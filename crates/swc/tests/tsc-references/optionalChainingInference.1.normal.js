//// [optionalChainingInference.ts]
// https://github.com/microsoft/TypeScript/issues/34579
var _su, _su1, _su2, _fnu, _su3, _osu_prop, _osu_prop1, _ofnu_prop, _object;
var b1 = {
    value: (_su = su) === null || _su === void 0 ? void 0 : _su.length
};
var v1 = unbox(b1);
var b2 = {
    value: (_su1 = su) === null || _su1 === void 0 ? void 0 : _su1.length
};
var v2 = unbox(b2);
var b3 = {
    value: (_su2 = su) === null || _su2 === void 0 ? void 0 : _su2.length
};
var v3 = unbox(b3);
var b4 = {
    value: (_fnu = fnu) === null || _fnu === void 0 ? void 0 : _fnu()
};
var v4 = unbox(b4);
var b5 = {
    value: (_su3 = su) === null || _su3 === void 0 ? void 0 : _su3["length"]
};
var v5 = unbox(b5);
var b6 = {
    value: (_osu_prop = osu) === null || _osu_prop === void 0 ? void 0 : _osu_prop.prop.length
};
var v6 = unbox(b6);
var b7 = {
    value: (_osu_prop1 = osu) === null || _osu_prop1 === void 0 ? void 0 : _osu_prop1.prop["length"]
};
var v7 = unbox(b7);
var b8 = {
    value: (_object = ofnu) === null || _object === void 0 ? void 0 : (_ofnu_prop = _object.prop) === null || _ofnu_prop === void 0 ? void 0 : _ofnu_prop.call(_object)
};
var v8 = unbox(b8);
