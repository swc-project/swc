enum DuplicateMembers {
    A = 1,
    A = 5,
    B,
    C = A + 1,
}

enum MergedMembers {
    A = 1,
}

enum MergedMembers {
    B = A + 1,
    C = MergedMembers.A + 2,
}

enum ForwardReference {
    A = Later + 1,
    Later = 1,
}

enum QualifiedForwardReference {
    A = QualifiedForwardReference.Later + 1,
    Later = 1,
}

enum SelfReference {
    A = SelfReference.A,
    B = B,
}

declare function getValue(): number;
enum OpaqueMembers {
    A = getValue(),
    B = A,
    C = OpaqueMembers.A,
}

enum ShadowedGlobals {
    Positive = Infinity,
    Infinity = 1,
    NotANumber = NaN,
    NaN = 2,
}

enum Globals {
    Positive = Infinity,
    NotANumber = NaN,
}
