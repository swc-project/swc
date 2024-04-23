//// [typeofImportTypeOnlyExport.ts]
//// [button.ts]
import { classMap } from './lit.js';
export var c = classMap();
//// [lit.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
