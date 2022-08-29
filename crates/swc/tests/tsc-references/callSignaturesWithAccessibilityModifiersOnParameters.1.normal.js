//// [callSignaturesWithAccessibilityModifiersOnParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  3 | function foo(public x, private y) { }
//!    :              ^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  3 | function foo(public x, private y) { }
//!    :                        ^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  4 | var f = function foo(public x, private y) { }
//!    :                      ^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  4 | var f = function foo(public x, private y) { }
//!    :                                ^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  5 | var f2 = function (public x, private y) { }
//!    :                    ^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  5 | var f2 = function (public x, private y) { }
//!    :                              ^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  6 | var f3 = (x, private y) => { }
//!    :              ^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  9 | function foo2(private x: string, public y: number) { }
//!    :               ^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  9 | function foo2(private x: string, public y: number) { }
//!    :                                  ^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!     :                       ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!     :                                          ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  11 | var f6 = function (private x: string, public y: number) { }
//!     :                    ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  11 | var f6 = function (private x: string, public y: number) { }
//!     :                                       ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     :           ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     :                              ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  16 | foo(public x, private y) { }
//!     :     ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  16 | foo(public x, private y) { }
//!     :               ^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  17 | foo2(public x: number, private y: string) { }
//!     :      ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  17 | foo2(public x: number, private y: string) { }
//!     :                        ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  18 | foo3<T>(public x: T, private y: T) { }
//!     :         ^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  18 | foo3<T>(public x: T, private y: T) { }
//!     :                      ^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  22 | (private x, public y);
//!     :  ^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  22 | (private x, public y);
//!     :             ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  23 | (private x: string, public y: number);
//!     :  ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  23 | (private x: string, public y: number);
//!     :                     ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  24 | foo(private x, public y);
//!     :     ^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  24 | foo(private x, public y);
//!     :                ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  25 | foo(public x: number, y: string);
//!     :     ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  26 | foo3<T>(x: T, private y: T);
//!     :               ^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  30 | foo(public x, private y);
//!     :     ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  30 | foo(public x, private y);
//!     :               ^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  31 | foo2(private x: number, public y: string);
//!     :      ^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  31 | foo2(private x: number, public y: string);
//!     :                         ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  35 | foo(public x, y) { },
//!     :     ^^^^^^^^
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,----
//!  36 | a: function foo(x: number, private y: string) { },
//!     :                            ^^^^^^^^^^^^^^^^^
//!     `----
