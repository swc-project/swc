//// [foo_0.ts]
"use strict";
//// [foo_1.ts]
/// <reference path="foo_0.ts"/>
"use strict";
var foo = require("foo");
var z = foo.x + 10;
