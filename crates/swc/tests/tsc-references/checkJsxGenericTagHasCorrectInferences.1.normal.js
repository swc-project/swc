//// [file.tsx]
import * as React from "react";
var a = <GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return a;
}}/>; // No error
var b = <GenericComponent initialValues={12} nextValues={function(a) {
    return a;
}}/>; // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
var c = <GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return {
        x: a.x
    };
}}/>; // No Error
var d = <GenericComponent initialValues={{
    x: "y"
}} nextValues={function(a) {
    return a.x;
}}/>; // Error - `string` is not assignable to `{x: string}`
