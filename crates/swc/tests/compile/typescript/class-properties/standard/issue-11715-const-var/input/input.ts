const s = "aThisIs";
const n = 1;
const concat = "a" + "b";
const chain = s;

enum StringEnum {
    A = s,
    B = "bThisIs",
}

enum NumericAutoIncrement {
    A = n,
    B,
    C,
}

enum ConstantExpr {
    A = concat,
    B = chain,
}
