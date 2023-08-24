//// [instantiateNonGenericTypeWithTypeArguments.ts]
// it is an error to provide type arguments to a non-generic call
// all of these are errors
var f, a;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    _class_call_check(this, C);
}(), new f(), new a();
