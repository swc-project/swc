import MyType from "../../../../swc_ecma_transforms_base/tests/ts-resolver/1/input";

type Tmpz = {
    <N extends number>(num: N): MyType
    <S extends string>(str: S): MyType
}

type Tmp = {
    <N extends number>(num: N): typeof num
    <S extends string>(str: S): typeof str
}

const foo: Tmp = <T,>(str: T): T => {
    return str;
}

console.log(foo("str"));

type Tmp1 = {
    <S extends string>(str: S): typeof str
}

type Tmp2 = {
    (num: number): number
    (str: string): string
}

type Tmp3 = {
    <N extends number>(num: N): number
    <S extends string>(str: S): string
}
