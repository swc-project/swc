import * as swcHelpers from "@swc/helpers";
var a;
a.toString();
a.nonExist(); // error
var destructuring = a.destructuring; // error
var rest = swcHelpers.extends({}, a); // ok
