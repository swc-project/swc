//// [classStaticBlock8.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(v) {
    label: for(; v;){
        if (function() {
            if (1 === v) break label;
            if (2 === v) continue label;
            if (3 === v) break;
            if (4 === v) continue;
        }(), 5 === v) break label;
        if (6 === v) continue label;
        if (7 === v) break;
        if (8 === v) continue;
    }
    !function() {
        loop: for(; v;){
            if (1 === v) break loop;
            if (2 === v) continue loop;
            if (3 === v) break;
            if (4 === v) continue;
        }
    }();
}
