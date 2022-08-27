//// [exportedEnumTypeAndValue.ts]
//// [def.js]
/** @enum {number} */ var MyEnum = {
    a: 1,
    b: 2
};
export default MyEnum;
//// [use.js]
import MyEnum from "./def";
/** @type {MyEnum} */ var v = MyEnum.b;
