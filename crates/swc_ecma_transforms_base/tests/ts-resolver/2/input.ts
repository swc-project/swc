interface Foo {
    (a: string): void;
    b: string;
}
interface Foo {
    (a: number): number;
    c: boolean;
    d: { x: number; y: number };
}
export = Foo;