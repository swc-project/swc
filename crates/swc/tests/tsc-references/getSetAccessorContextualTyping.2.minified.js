//// [getSetAccessorContextualTyping.ts]
// In the body of a get accessor with no return type annotation,
// if a matching set accessor exists and that set accessor has a parameter type annotation,
// return expressions are contextually typed by the type given in the set accessor's parameter type annotation.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
