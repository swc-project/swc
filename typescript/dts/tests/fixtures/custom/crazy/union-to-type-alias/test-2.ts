// @declaration: true

type PrimitiveName = 'string' | 'number' | 'boolean';

function getFalsyPrimitive(x: "string"): string;
function getFalsyPrimitive(x: "number"): number;
function getFalsyPrimitive(x: "boolean"): boolean;
function getFalsyPrimitive(x: "boolean" | "string"): boolean | string;
function getFalsyPrimitive(x: "boolean" | "number"): boolean | number;
function getFalsyPrimitive(x: "number" | "string"): number | string;
function getFalsyPrimitive(x: "number" | "string" | "boolean"): number | string | boolean;
function getFalsyPrimitive(x: PrimitiveName): number | string | boolean {
    if (x === "string") {
        return "";
    }
    if (x === "number") {
        return 0;
    }
    if (x === "boolean") {
        return false;
    }

    // Should be unreachable.
    throw "Invalid value";
}

const string: "string" = "string";
const number: "number" = "number";
const boolean: "boolean" = "boolean";

const stringOrNumber = string || number;
const stringOrBoolean = string || boolean;
const booleanOrNumber = number || boolean;
const stringOrBooleanOrNumber = stringOrBoolean || number;
