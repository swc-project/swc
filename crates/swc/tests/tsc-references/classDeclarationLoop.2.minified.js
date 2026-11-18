//// [classDeclarationLoop.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
for(var arr = [], i = 0; i < 10; ++i)!function(i) {
    arr.push(function C() {
        _class_call_check(this, C), this.prop = i;
    });
}(i);
