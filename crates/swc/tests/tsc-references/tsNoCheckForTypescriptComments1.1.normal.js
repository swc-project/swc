//// [file.ts]
// @ts-nocheck additional comments
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var a = 1 + {}; // This is an error, ofc, `Operator '+' cannot be applied to types '1' and '{}'`, which will be suppressed by the `nocheck` comment
export var Bet = function Bet() {
    "use strict";
    _class_call_check(this, Bet);
    this.q = 'lol' // And so will this implements error
    ;
};
