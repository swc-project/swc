#![allow(non_upper_case_globals)]

use bitflags::bitflags;
use swc_common::add_bitflags;

bitflags! {
    pub struct TypeFacts: u32 {
        const None = 0;
    }
}

add_bitflags!(
    TypeFacts,
    // Handled by bitflags! macro.
    // Values { None: 0 },
    /// Line separators
    Values {
        /// typeof x === "string"
        TypeofEQString: 1 << 0,
        /// typeof x === "number"
        TypeofEQNumber: 1 << 1,
        /// typeof x === "bigint"
        TypeofEQBigInt: 1 << 2,
        /// typeof x === "boolean"
        TypeofEQBoolean: 1 << 3,
        /// typeof x === "symbol"
        TypeofEQSymbol: 1 << 4,
        /// typeof x === "object"
        TypeofEQObject: 1 << 5,
        /// typeof x === "function"
        TypeofEQFunction: 1 << 6,
        /// typeof x === "xxx"
        TypeofEQHostObject: 1 << 7,
        /// typeof x !== "string"
        TypeofNEString: 1 << 8,
        /// typeof x !== "number"
        TypeofNENumber: 1 << 9,
        /// typeof x !== "bigint"
        TypeofNEBigInt: 1 << 10,
        /// typeof x !== "boolean"
        TypeofNEBoolean: 1 << 11,
        /// typeof x !== "symbol"
        TypeofNESymbol: 1 << 12,
        /// typeof x !== "object"
        TypeofNEObject: 1 << 13,
        /// typeof x !== "function"
        TypeofNEFunction: 1 << 14,
        /// typeof x !== "xxx"
        TypeofNEHostObject: 1 << 15,
        /// x === undefined
        EQUndefined: 1 << 16,
        /// x === null
        EQNull: 1 << 17,
        /// x === undefined / x === null
        EQUndefinedOrNull: 1 << 18,
        /// x !== undefined
        NEUndefined: 1 << 19,
        /// x !== null
        NENull: 1 << 20,
        /// x != undefined / x != null
        NEUndefinedOrNull: 1 << 21,
        /// x
        Truthy: 1 << 22,
        /// !x
        Falsy: 1 << 23,
        All: (1 << 24) - 1,
    },
    /// Delimiters
    Values {
        BaseStringStrictFacts: TypeofEQString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull,
        BaseStringFacts: BaseStringStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        StringStrictFacts: BaseStringStrictFacts | Truthy | Falsy,
        StringFacts: BaseStringFacts | Truthy,
        EmptyStringStrictFacts: BaseStringStrictFacts | Falsy,
        EmptyStringFacts: BaseStringFacts,
        NonEmptyStringStrictFacts: BaseStringStrictFacts | Truthy,
        NonEmptyStringFacts: BaseStringFacts | Truthy,
        BaseNumberStrictFacts: TypeofEQNumber
            | TypeofNEString
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull,
        BaseNumberFacts: BaseNumberStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        NumberStrictFacts: BaseNumberStrictFacts | Truthy | Falsy,
        NumberFacts: BaseNumberFacts | Truthy,
        ZeroNumberStrictFacts: BaseNumberStrictFacts | Falsy,
        ZeroNumberFacts: BaseNumberFacts,
        NonZeroNumberStrictFacts: BaseNumberStrictFacts | Truthy,
        NonZeroNumberFacts: BaseNumberFacts | Truthy,
        BaseBigIntStrictFacts: TypeofEQBigInt
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull,
        BaseBigIntFacts: BaseBigIntStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        BigIntStrictFacts: BaseBigIntStrictFacts | Truthy | Falsy,
        BigIntFacts: BaseBigIntFacts | Truthy,
        ZeroBigIntStrictFacts: BaseBigIntStrictFacts | Falsy,
        ZeroBigIntFacts: BaseBigIntFacts,
        NonZeroBigIntStrictFacts: BaseBigIntStrictFacts | Truthy,
        NonZeroBigIntFacts: BaseBigIntFacts | Truthy,
        BaseBooleanStrictFacts: TypeofEQBoolean
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNESymbol
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull,
        BaseBooleanFacts: BaseBooleanStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        BooleanStrictFacts: BaseBooleanStrictFacts | Truthy | Falsy,
        BooleanFacts: BaseBooleanFacts | Truthy,
        FalseStrictFacts: BaseBooleanStrictFacts | Falsy,
        FalseFacts: BaseBooleanFacts,
        TrueStrictFacts: BaseBooleanStrictFacts | Truthy,
        TrueFacts: BaseBooleanFacts | Truthy,
        SymbolStrictFacts: TypeofEQSymbol
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull
            | Truthy,
        SymbolFacts: SymbolStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        ObjectStrictFacts: TypeofEQObject
            | TypeofEQHostObject
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEFunction
            | NEUndefined
            | NENull
            | NEUndefinedOrNull
            | Truthy,
        ObjectFacts: ObjectStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        FunctionStrictFacts: TypeofEQFunction
            | TypeofEQHostObject
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEObject
            | NEUndefined
            | NENull
            | NEUndefinedOrNull
            | Truthy,
        FunctionFacts: FunctionStrictFacts | EQUndefined | EQNull | EQUndefinedOrNull | Falsy,
        UndefinedFacts: TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEObject
            | TypeofNEFunction
            | TypeofNEHostObject
            | EQUndefined
            | EQUndefinedOrNull
            | NENull
            | Falsy,
        NullFacts: TypeofEQObject
            | TypeofNEString
            | TypeofNENumber
            | TypeofNEBigInt
            | TypeofNEBoolean
            | TypeofNESymbol
            | TypeofNEFunction
            | TypeofNEHostObject
            | EQNull
            | EQUndefinedOrNull
            | NEUndefined
            | Falsy,
        EmptyObjectStrictFacts: TypeFacts::All.bits
            & !(TypeFacts::EQUndefined.bits
                | TypeFacts::EQNull.bits
                | TypeFacts::EQUndefinedOrNull.bits),
        EmptyObjectFacts: All,
    },
);

impl TypeFacts {
    pub fn typeof_eq(s: &str) -> Option<Self> {
        Some(match s {
            "string:" => TypeFacts::TypeofEQString,
            "number" => TypeFacts::TypeofEQNumber,
            "bigint" => TypeFacts::TypeofEQBigInt,
            "boolean" => TypeFacts::TypeofEQBoolean,
            "symbol" => TypeFacts::TypeofEQSymbol,
            "undefined" => TypeFacts::EQUndefined,
            "object" => TypeFacts::TypeofEQObject,
            "function" => TypeFacts::TypeofEQFunction,
            _ => return None,
        })
    }
    pub fn typeof_neq(s: &str) -> Option<Self> {
        Some(match s {
            "string:" => TypeFacts::TypeofNEString,
            "number" => TypeFacts::TypeofNENumber,
            "bigint" => TypeFacts::TypeofNEBigInt,
            "boolean" => TypeFacts::TypeofNEBoolean,
            "symbol" => TypeFacts::TypeofNESymbol,
            "undefined" => TypeFacts::NEUndefined,
            "object" => TypeFacts::TypeofNEObject,
            "function" => TypeFacts::TypeofNEFunction,
            _ => return None,
        })
    }
}
