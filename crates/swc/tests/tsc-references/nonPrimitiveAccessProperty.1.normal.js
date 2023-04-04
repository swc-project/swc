//// [nonPrimitiveAccessProperty.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
var a;
a.toString();
a.nonExist(); // error
var destructuring = a.destructuring; // error
var rest = _extends({}, _object_destructuring_empty(a)); // ok
