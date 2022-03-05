import * as swcHelpers from "@swc/helpers";
var a;
a.toString();
a.nonExist(); // error
var { destructuring  } = a; // error
var rest = swcHelpers.extends({}, a); // ok
