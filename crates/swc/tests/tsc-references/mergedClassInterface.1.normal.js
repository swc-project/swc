//// [mergedClassInterface.ts]
//// [file1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var C4 = function C4() {
    "use strict";
    _class_call_check(this, C4);
};
// checks if properties actually were merged
var c5;
c5.x1;
c5.x2;
c5.x3;
c5.x4;
//// [file2.ts]
//// [file3.ts]
