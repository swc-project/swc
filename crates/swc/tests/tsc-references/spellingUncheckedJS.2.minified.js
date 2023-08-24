//// [spellingUncheckedJS.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var inModule = 1;
inmodule.toFixed();
var object = {};
object.spaaaace // error on read
, object.spaace = 12 // error on write
, object.fresh = 12 // OK
, other.puuuce // OK, from another file
, new Date().getGMTDate() // OK, from another file
, setIntegral(function() {
    return console.log("ok");
}, 500), AudioBuffin // etc
, Jimmy, Jon;
//// [other.js]
Jon // error, it's from the same file
;
