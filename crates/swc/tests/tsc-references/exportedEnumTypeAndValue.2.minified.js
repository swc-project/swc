//// [exportedEnumTypeAndValue.ts]
//// [def.js]
var MyEnum = {
    a: 1,
    b: 2
};
export default MyEnum;
//// [use.js]
import MyEnum from "./def";
var v = MyEnum.b;
