//// [typeofImportTypeOnlyExport.ts]
//// [button.ts]
import { classMap } from "./lit.js";
export var c = classMap();
//// [lit.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ClassMapDirective = function ClassMapDirective() {
    "use strict";
    _class_call_check(this, ClassMapDirective);
};
export var directive = function(class_) {
    return function() {
        return {
            directive: class_
        };
    };
};
export var classMap = directive(ClassMapDirective);
