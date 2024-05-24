//// [typeGuardsWithAny.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var x = {
    p: 0
};
if (_instanceof(x, Object)) {
    x.p; // No error, type any unaffected by instanceof type guard
} else {
    x.p; // No error, type any unaffected by instanceof type guard
}
if (typeof x === "string") {
    x.p; // Error, type any narrowed by primitive type check
} else {
    x.p; // No error, type unaffected in this branch
}
if (typeof x === "number") {
    x.p; // Error, type any narrowed by primitive type check
} else {
    x.p; // No error, type unaffected in this branch
}
if (typeof x === "boolean") {
    x.p; // Error, type any narrowed by primitive type check
} else {
    x.p; // No error, type unaffected in this branch
}
if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
    x.p; // No error, type any only affected by primitive type check
} else {
    x.p; // No error, type unaffected in this branch
}
