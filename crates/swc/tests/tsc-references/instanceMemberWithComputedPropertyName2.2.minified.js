//// [instanceMemberWithComputedPropertyName2.ts]
"use strict";
import _define_property from "@swc/helpers/src/_define_property.mjs";
let x = 1, _x = 1;
class C {
    constructor(){
        _define_property(this, _x, void 0);
    }
}
