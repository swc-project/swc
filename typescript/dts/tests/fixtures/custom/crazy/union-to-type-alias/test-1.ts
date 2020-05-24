type PrimitiveName = 'string' | 'number' | 'boolean';

const string: "string" = "string";
const number: "number" = "number";
const boolean: "boolean" = "boolean";

const stringOrBoolean = string || boolean;
const stringOrBooleanOrNumber = stringOrBoolean || number;