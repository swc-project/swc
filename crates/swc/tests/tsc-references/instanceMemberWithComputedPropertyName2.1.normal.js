//// [instanceMemberWithComputedPropertyName2.ts]
// https://github.com/microsoft/TypeScript/issues/33857
"use strict";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
const x = 1;
let _x = x;
class C {
    constructor(){
        _define_property(this, _x, void 0);
    }
}
