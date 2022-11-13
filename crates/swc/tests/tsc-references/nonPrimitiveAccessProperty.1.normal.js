//// [nonPrimitiveAccessProperty.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
var a;
a.toString();
a.nonExist(); // error
var destructuring = a.destructuring; // error
var rest = _extends({}, _object_destructuring_empty(a)); // ok
