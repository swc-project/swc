declare const foo: 'foo';

class B {
    [foo](x: number);
    [foo](x: string);
    [foo](x: any) {
    }
}