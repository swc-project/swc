//// [exportedEnumTypeAndValue.ts]
//// [def.js]
export default {
    a: 1,
    b: 2
};
//// [use.js]
import MyEnum from "./def";
MyEnum.b;
