let x /**/: number/**/ = 1!;
//        ^^^^^^^^        ^

[] as [] satisfies [];
// ^^^^^^^^^^^^^^^^^^

(<string>"test");
//^^^^^^^^

class C /**/<T>/*︎*/ extends Array/**/<T> /*︎*/ implements I, J/*︎*/ {
    //          ^^^^^                      ^^^     ^^^^^^^^^^^^^^
    readonly field/**/: string/**/ = "";
    //  ^^^^^^^^          ^^^^^^^^
    static accessor f1;
    private f2/**/!/**/: string/*︎*/;
    //  ^^^^^^^       ^    ^^^^^^^^
    declare f3: any;
    //  ^^^^^^^^^^^^^^^^ declared property

    public method/**/<T>/*︎*/(/*︎*/this: T,/**/ a? /*︎*/: string/**/)/*︎*/: void/*︎*/ {
        //  ^^^^^^           ^^^         ^^^^^^^^      ^     ^^^^^^^^         ^^^^^^
    }

    [key: string]: any;
    //  ^^^^^^^^^^^^^^^^^^^ index signature

    get g(): any { return 1 };
    //         ^^^^^
    set g(v: any) { };
    //         ^^^^^
}

class D extends C<any> {
    //               ^^^^^
    override method(...args): any { }
    //  ^^^^^^^^                ^^^^^
}

abstract class A {
    // ^^^^^^^^
    abstract a;
    //  ^^^^^^^^^^^ abstract property
    b;
    abstract method();
    //  ^^^^^^^^^^^^^^^^^^ abstract method
}

{
    let m = new (Map!)<string, number>([]!);
    //              ^ ^^^^^^^^^^^^^^^^   ^
}

{
    let a = (foo!)<any>;
    //          ^ ^^^^^
}

{
    let a = (foo!)<any>([]!);
    //          ^ ^^^^^   ^
}

{
    let f = function (p: any) { }
    //                ^^^^^
}

{
    function overload(): number;
    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ overload
    function overload(): any { }
    //                     ^^^^^
}

/** @doc */
interface I { }
// ^^^^^^^^^^^ interface

void 0;

/** @doc */
type J = I;
// ^^^^^^^^ type alias

/**/import type T from "node:assert";
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `import type`

/**/export type { I };
//  ^^^^^^^^^^^^^^^^^^ `export type`

/**/export type * from "node:buffer";
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `export type *`

import { type AssertPredicate/**/, deepEqual } from "node:assert";
//      ^^^^^^^^^^^^^^^^^^^^^^^^^

export {
    C,
    type T,
    //  ^^^^^^
}

/**/export type T2 = 1;
//  ^^^^^^^^^^^^^^^^^^^

function foo<T>(p: any = (): any => 1): any {
    //          ^^^  ^^^^^     ^^^^^      ^^^^^
    return p as any;
    //           ^^^^^^
}

/**/declare enum E1 { }
//  ^^^^^^^^^^^^^^^^^^ `declare enum`

void 0;

/**/declare namespace N { }
//  ^^^^^^^^^^^^^^^^^^^^^^ `declare namespace`

void 0;

/**/declare module M { }
//  ^^^^^^^^^^^^^^^^^^^ `declare module`

void 0;

/**/declare let a;
//  ^^^^^^^^^^^^^^ `declare let`

void 0;

/**/declare class DeclaredClass { }
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `declare class`

void 0;

/**/declare function DeclaredFunction(): void;
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `declare function`

void 0;

// `=>` spanning line cases:
{
    ()
        : any =>
        1
};
{
    ():
        any =>
        1
};
{
    (
    )
        : any =>
        1
};
{
    (
    ): (
            | any
        ) =>
        1
};
{
    (
    ):
        NonNullable<any
        > =>
        1
};
{
    (a, b, c: D = [] as any/*comment-1*/)/*comment-2*/:
        any =>
        1
};


    ():
        any=>
        1;

{
    (a, b, c: D = [] as any/*comment-1*/)/*comment-2*/:
        /*comment-3*/any/*comment-4*/=>
        1
};

type 任意の型 = any;

():
任意の型=>
1;

()/*comment-1*/:/*comment-2*/
/*comment-3*/任意の型/*comment-4*/=>
1;