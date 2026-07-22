import { importedValue } from "pkg";

const known = 1;
const unknown = makeValue();
const typed: number = 1;
let mutable = 1;
function makeValue(): number {
    return 1;
}
class Holder {
    static value = 1;
}

export enum Direct {
    Known = known,
    Unknown = unknown,
    Typed = typed,
    Imported = importedValue,
    Mutable = mutable,
    Function = makeValue(),
    Class = Holder.value,
}

export enum Binary {
    KnownUnknown = known + Missing,
    UnknownKnown = Missing + known,
    KnownMutable = known + mutable,
    MutableKnown = mutable + known,
    KnownMember = Direct.Known + 1,
    UnknownMember = Direct.Unknown + 1,
}

export enum Template {
    Known = `${known}`,
    Unknown = `${unknown}`,
    KnownUnknown = `${known}${Missing}`,
    UnknownKnown = `${Missing}${known}`,
    KnownPlusUnknown = `${known + Missing}`,
    UnknownPlusKnown = `${Missing + known}`,
}

export enum Propagation {
    External = known,
    FromExternal = External + 1,
    Implicit,
    FromImplicit = Implicit + 1,
    Reset = 10,
    FromReset = Reset + 1,
}

export enum DuplicateMembers {
    A = 1,
    A = 5,
    B,
    C = A + 1,
}

export enum MergedMembers {
    A = 1,
}

export enum MergedMembers {
    B = A + 1,
    C = MergedMembers.A + 2,
}

export enum ForwardReference {
    A = Later + 1,
    Later = 1,
}

export enum QualifiedForwardReference {
    A = QualifiedForwardReference.Later + 1,
    Later = 1,
}

export enum SelfReference {
    A = SelfReference.A,
    B = B,
}

export enum OpaqueMembers {
    A = makeValue(),
    B = A,
    C = OpaqueMembers.A,
}

export enum UnsupportedEvaluation {
    UnaryString = -"1",
    OptionalMember = Direct?.Known,
}

export enum ShadowedGlobals {
    Positive = Infinity,
    Infinity = 1,
    NotANumber = NaN,
    NaN = 2,
}

export enum Globals {
    Positive = Infinity,
    NotANumber = NaN,
}
