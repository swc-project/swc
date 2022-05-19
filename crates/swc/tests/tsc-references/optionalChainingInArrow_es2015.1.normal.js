// @target: es5
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/41814
const test = (names)=>{
    // single-line comment
    return names === null || names === void 0 ? void 0 : names.filter((x)=>x);
};
