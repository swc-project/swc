declare const fromAmbientConst = 1;
enum AmbientConstNum {
    A = fromAmbientConst,
    B
}

declare const fromAmbientStr = "v";
enum AmbientConstStr {
    A = fromAmbientStr
}

declare enum Ambient {
    X = 1,
    Y = X + 1,
    S = "s",
    NoInit
}

const viaConst = Ambient.X;
enum ViaConst {
    P = viaConst,
    Q
}

enum Direct {
    P = Ambient.Y,
    Q
}

const stillRuntime = Ambient.NoInit;
enum StaysRuntime {
    P = stillRuntime,
    Q
}

console.log(Ambient.X);

declare const enum AmbientConst {
    X,
    Y = 5,
    Z
}

const fromConstEnum = AmbientConst.Z;
enum FromAmbientConstEnum {
    P = fromConstEnum,
    Q
}

enum Concrete {
    K = 40
}

declare enum AmbientFromConcrete {
    Y = Concrete.K + 2
}

enum ResultChain {
    A = AmbientFromConcrete.Y,
    B
}

enum Merged {
    X = 1
}
declare enum Merged {
    Y = 5
}
enum FromMerged {
    P = Merged.Y,
    Q
}
console.log(Merged.Y);

const seed = 1;
declare enum AmbientFromConst {
    Y = seed
}
enum ChainBack {
    P = AmbientFromConst.Y,
    Q
}

declare enum AmbientAsserted {
    X = 1
}
enum AssertedRead {
    A = AmbientAsserted.X as number,
    B
}
const assertedVia = AmbientAsserted.X as number;
enum AssertedViaConst {
    A = assertedVia,
    B
}

declare enum AssertedSibling {
    X = 1,
    Y = X as number
}
const viaAssertedSibling = AssertedSibling.Y;
enum FromAssertedSibling {
    P = viaAssertedSibling,
    Q
}

declare enum AssertedInit {
    X = 1 as number
}
enum FromAssertedInit {
    Y = AssertedInit.X,
    Z
}
