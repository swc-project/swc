enum Str {
    A = "a"
}
const fromStr = Str.A;
enum FromEnumMemberStr {
    X = fromStr,
    Y = "y"
}

enum Num {
    A = 1
}
const fromNum = Num.A;
enum FromEnumMemberNum {
    X = fromNum,
    Y
}
