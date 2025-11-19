//// [typeOfThisInConstructorParamList.ts]
//type of 'this' in constructor param list is the class instance type (error)
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ErrClass = function ErrClass() {
    "use strict";
    var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    _class_call_check(this, ErrClass);
};
