//// [classStaticBlock8.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(v) {
    label: while(v){
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        var __ = {
            writable: true,
            value: function() {
                if (v === 1) {
                    break label;
                }
                if (v === 2) {
                    continue label;
                }
                if (v === 3) {
                    break;
                }
                if (v === 4) {
                    continue;
                }
            }()
        };
        if (v === 5) {
            break label;
        }
        if (v === 6) {
            continue label;
        }
        if (v === 7) {
            break;
        }
        if (v === 8) {
            continue;
        }
    }
    var C1 = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var __1 = {
        writable: true,
        value: function() {
            outer: break outer; // valid
            loop: while(v){
                if (v === 1) break loop; // valid
                if (v === 2) continue loop; // valid
                if (v === 3) break; // valid
                if (v === 4) continue; // valid
            }
            switch(v){
                default:
                    break; // valid
            }
        }()
    };
}
