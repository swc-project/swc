declare const someDec: any;

class A {
    @someDec
    j: readonly string[] = [];
    @someDec
    k: readonly [string, number] = ['foo', 42];
}
