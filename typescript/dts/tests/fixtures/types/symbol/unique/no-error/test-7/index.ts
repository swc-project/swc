// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// classes
class C {
    static readonly readonlyStaticCall = Symbol();
    static readonly readonlyStaticType: unique symbol;
    static readonly readonlyStaticTypeAndCall: unique symbol = Symbol();
    static readwriteStaticCall = Symbol();

    readonly readonlyCall = Symbol();
    readwriteCall = Symbol();
}

declare const c: C;

const constInitToCReadonlyStaticCall = C.readonlyStaticCall;
const constInitToCReadonlyStaticType = C.readonlyStaticType;
const constInitToCReadonlyStaticTypeAndCall = C.readonlyStaticTypeAndCall;
const constInitToCReadwriteStaticCall = C.readwriteStaticCall;

const constInitToCReadonlyStaticCallWithTypeQuery: typeof C.readonlyStaticCall = C.readonlyStaticCall;
const constInitToCReadonlyStaticTypeWithTypeQuery: typeof C.readonlyStaticType = C.readonlyStaticType;
const constInitToCReadonlyStaticTypeAndCallWithTypeQuery: typeof C.readonlyStaticTypeAndCall = C.readonlyStaticTypeAndCall;
const constInitToCReadwriteStaticCallWithTypeQuery: typeof C.readwriteStaticCall = C.readwriteStaticCall;

const constInitToCReadonlyCall = c.readonlyCall;
const constInitToCReadwriteCall = c.readwriteCall;
const constInitToCReadonlyCallWithTypeQuery: typeof c.readonlyCall = c.readonlyCall;
const constInitToCReadwriteCallWithTypeQuery: typeof c.readwriteCall = c.readwriteCall;
const constInitToCReadonlyCallWithIndexedAccess: C["readonlyCall"] = c.readonlyCall;
const constInitToCReadwriteCallWithIndexedAccess: C["readwriteCall"] = c.readwriteCall;

