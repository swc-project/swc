export const foo1 = 1;
export var foo2: number = "abc";
export enum Foo3 {
    A = "foo",
    B = "bar",
}

export enum NonFiniteStrings {
    Positive = 1 / 0,
    PositiveString = Positive + "",
    Negative = -Positive,
    NegativeString = Negative + "",
    NotANumber = 0 / 0,
    NaNString = NotANumber + "",
}
