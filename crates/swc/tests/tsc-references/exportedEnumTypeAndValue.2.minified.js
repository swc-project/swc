//// [exportedEnumTypeAndValue.ts]
//// [def.js]
/** @enum {number} */ export default {
    a: 1,
    b: 2
};
//// [use.js]
import MyEnum from "./def";
/** @type {MyEnum} */ MyEnum.b;
