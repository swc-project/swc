// checking subtype relations for function types as it relates to contextual signature instantiation

class Base { foo: string; }
class Derived extends Base { bar: string; }
class Derived2 extends Derived { baz: string; }
class OtherDerived extends Base { bing: string; }

interface A { // T
    // M's
    a: (x: number) => number[];
    a2: (x: number) => string[];
    a3: (x: number) => void;
    a4: (x: string, y: number) => string;
    a5: (x: (arg: string) => number) => string;
    a6: (x: (arg: Base) => Derived) => Base;
    a7: (x: (arg: Base) => Derived) => (r: Base) => Derived;
    a8: (x: (arg: Base) => Derived, y: (arg2: Base) => Derived) => (r: Base) => Derived;
    a9: (x: (arg: Base) => Derived, y: (arg2: Base) => Derived) => (r: Base) => Derived;
    a10: (...x: Derived[]) => Derived;
    a11: (x: { foo: string }, y: { foo: string; bar: string }) => Base;
    a12: (x: Array<Base>, y: Array<Derived2>) => Array<Derived>;
    a13: (x: Array<Base>, y: Array<Derived>) => Array<Derived>;
    a14: (x: { a: string; b: number }) => Object;
    a15: {
        (x: number): number[];
        (x: string): string[];
    };
    a16: {
        <T extends Derived>(x: T): number[];
        <U extends Base>(x: U): number[];
    };
    a17: {
        (x: (a: number) => number): number[];
        (x: (a: string) => string): string[];
    };
    a18: {
        (x: {
            (a: number): number;
            (a: string): string;
        }): any[];
        (x: {
            (a: boolean): boolean;
            (a: Date): Date;
        }): any[];
    };
}

// S's
interface I extends A {
    // N's
    a: <T>(x: T) => T[]; // ok, instantiation of N is a subtype of M, T is number
    a2: <T>(x: T) => string[]; // ok
    a3: <T>(x: T) => T; // ok since Base returns void
    a4: <T, U>(x: T, y: U) => T; // ok, instantiation of N is a subtype of M, T is string, U is number
    a5: <T, U>(x: (arg: T) => U) => T; // ok, U is in a parameter position so inferences can be made
    a6: <T extends Base, U extends Derived>(x: (arg: T) => U) => T; // ok, same as a5 but with object type hierarchy
    a7: <T extends Base, U extends Derived>(x: (arg: T) => U) => (r: T) => U; // ok
    a8: <T extends Base, U extends Derived>(x: (arg: T) => U, y: (arg2: T) => U) => (r: T) => U; // ok
    a9: <T extends Base, U extends Derived>(x: (arg: T) => U, y: (arg2: { foo: string; bing: number }) => U) => (r: T) => U; // ok, same as a8 with compatible object literal
    a10: <T extends Derived>(...x: T[]) => T; // ok
    a11: <T extends Base>(x: T, y: T) => T; // ok
    a12: <T extends Array<Base>>(x: Array<Base>, y: T) => Array<Derived>; // ok, less specific parameter type
    a13: <T extends Array<Derived>>(x: Array<Base>, y: T) => T; // ok, T = Array<Derived>, satisfies constraint, contextual signature instantiation succeeds
    a14: <T, U>(x: { a: T; b: U }) => T; // ok
    a15: <T>(x: T) => T[]; // ok
    a16: <T extends Base>(x: T) => number[]; // ok
    a17: <T>(x: (a: T) => T) => T[]; // ok
    a18: <T>(x: (a: T) => T) => T[]; // ok, no inferences for T but assignable to any
}