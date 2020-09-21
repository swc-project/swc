// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// interfaces
interface I {
    readonly readonlyType: unique symbol;
}

declare const i: I;

const constInitToIReadonlyType = i.readonlyType;
const constInitToIReadonlyTypeWithTypeQuery: typeof i.readonlyType = i.readonlyType;
const constInitToIReadonlyTypeWithIndexedAccess: I["readonlyType"] = i.readonlyType;
