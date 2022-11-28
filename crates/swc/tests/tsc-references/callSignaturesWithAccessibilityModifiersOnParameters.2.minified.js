//// [callSignaturesWithAccessibilityModifiersOnParameters.ts]
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | // Call signature parameters do not allow accessibility modifiers
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!    :              ^^^^^^^^
//!  4 | var f = function foo(public x, private y) { }
//!  5 | var f2 = function (public x, private y) { }
//!  6 | var f3 = (x, private y) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | // Call signature parameters do not allow accessibility modifiers
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!    :                        ^^^^^^^^^
//!  4 | var f = function foo(public x, private y) { }
//!  5 | var f2 = function (public x, private y) { }
//!  6 | var f3 = (x, private y) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | // Call signature parameters do not allow accessibility modifiers
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!  4 | var f = function foo(public x, private y) { }
//!    :                      ^^^^^^^^
//!  5 | var f2 = function (public x, private y) { }
//!  6 | var f3 = (x, private y) => { }
//!  7 | var f4 = <T>(public x: T, y: T) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | // Call signature parameters do not allow accessibility modifiers
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!  4 | var f = function foo(public x, private y) { }
//!    :                                ^^^^^^^^^
//!  5 | var f2 = function (public x, private y) { }
//!  6 | var f3 = (x, private y) => { }
//!  7 | var f4 = <T>(public x: T, y: T) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[2:1]
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!  4 | var f = function foo(public x, private y) { }
//!  5 | var f2 = function (public x, private y) { }
//!    :                    ^^^^^^^^
//!  6 | var f3 = (x, private y) => { }
//!  7 | var f4 = <T>(public x: T, y: T) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[2:1]
//!  2 | 
//!  3 | function foo(public x, private y) { }
//!  4 | var f = function foo(public x, private y) { }
//!  5 | var f2 = function (public x, private y) { }
//!    :                              ^^^^^^^^^
//!  6 | var f3 = (x, private y) => { }
//!  7 | var f4 = <T>(public x: T, y: T) => { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[3:1]
//!  3 | function foo(public x, private y) { }
//!  4 | var f = function foo(public x, private y) { }
//!  5 | var f2 = function (public x, private y) { }
//!  6 | var f3 = (x, private y) => { }
//!    :              ^^^^^^^^^
//!  7 | var f4 = <T>(public x: T, y: T) => { }
//!  8 | 
//!  9 | function foo2(private x: string, public y: number) { }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[6:1]
//!   6 | var f3 = (x, private y) => { }
//!   7 | var f4 = <T>(public x: T, y: T) => { }
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!     :               ^^^^^^^^^^^^^^^^^
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[6:1]
//!   6 | var f3 = (x, private y) => { }
//!   7 | var f4 = <T>(public x: T, y: T) => { }
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!     :                                  ^^^^^^^^^^^^^^^^
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[7:1]
//!   7 | var f4 = <T>(public x: T, y: T) => { }
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!     :                       ^^^^^^^^^^^^^^^^^
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[7:1]
//!   7 | var f4 = <T>(public x: T, y: T) => { }
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!     :                                          ^^^^^^^^^^^^^^^^
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[8:1]
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!     :                    ^^^^^^^^^^^^^^^^^
//!  12 | var f7 = (private x: string, public y: number) => { }
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[8:1]
//!   8 | 
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!     :                                       ^^^^^^^^^^^^^^^^
//!  12 | var f7 = (private x: string, public y: number) => { }
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[9:1]
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     :           ^^^^^^^^^^^^^^^^^
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!  14 | 
//!  15 | class C {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[9:1]
//!   9 | function foo2(private x: string, public y: number) { }
//!  10 | var f5 = function foo(private x: string, public y: number) { }
//!  11 | var f6 = function (private x: string, public y: number) { }
//!  12 | var f7 = (private x: string, public y: number) => { }
//!     :                              ^^^^^^^^^^^^^^^^
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!  14 | 
//!  15 | class C {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[13:1]
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!  14 | 
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!     :         ^^^^^^^^
//!  17 |     foo2(public x: number, private y: string) { }
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!  19 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[13:1]
//!  13 | var f8 = <T>(private x: T, public y: T) => { }
//!  14 | 
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!     :                   ^^^^^^^^^
//!  17 |     foo2(public x: number, private y: string) { }
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!  19 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[14:1]
//!  14 | 
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!  17 |     foo2(public x: number, private y: string) { }
//!     :          ^^^^^^^^^^^^^^^^
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!  19 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[14:1]
//!  14 | 
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!  17 |     foo2(public x: number, private y: string) { }
//!     :                            ^^^^^^^^^^^^^^^^^
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!  19 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[15:1]
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!  17 |     foo2(public x: number, private y: string) { }
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!     :             ^^^^^^^^^^^
//!  19 | }
//!  20 | 
//!  21 | interface I {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[15:1]
//!  15 | class C {
//!  16 |     foo(public x, private y) { }
//!  17 |     foo2(public x: number, private y: string) { }
//!  18 |     foo3<T>(public x: T, private y: T) { }
//!     :                          ^^^^^^^^^^^^
//!  19 | }
//!  20 | 
//!  21 | interface I {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[19:1]
//!  19 | }
//!  20 | 
//!  21 | interface I {
//!  22 |     (private x, public y);
//!     :      ^^^^^^^^^
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[19:1]
//!  19 | }
//!  20 | 
//!  21 | interface I {
//!  22 |     (private x, public y);
//!     :                 ^^^^^^^^
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[20:1]
//!  20 | 
//!  21 | interface I {
//!  22 |     (private x, public y);
//!  23 |     (private x: string, public y: number);
//!     :      ^^^^^^^^^^^^^^^^^
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!  26 |     foo3<T>(x: T, private y: T);
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[20:1]
//!  20 | 
//!  21 | interface I {
//!  22 |     (private x, public y);
//!  23 |     (private x: string, public y: number);
//!     :                         ^^^^^^^^^^^^^^^^
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!  26 |     foo3<T>(x: T, private y: T);
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[21:1]
//!  21 | interface I {
//!  22 |     (private x, public y);
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!     :         ^^^^^^^^^
//!  25 |     foo(public x: number, y: string);
//!  26 |     foo3<T>(x: T, private y: T);
//!  27 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[21:1]
//!  21 | interface I {
//!  22 |     (private x, public y);
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!     :                    ^^^^^^^^
//!  25 |     foo(public x: number, y: string);
//!  26 |     foo3<T>(x: T, private y: T);
//!  27 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[22:1]
//!  22 |     (private x, public y);
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!     :         ^^^^^^^^^^^^^^^^
//!  26 |     foo3<T>(x: T, private y: T);
//!  27 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[23:1]
//!  23 |     (private x: string, public y: number);
//!  24 |     foo(private x, public y);
//!  25 |     foo(public x: number, y: string);
//!  26 |     foo3<T>(x: T, private y: T);
//!     :                   ^^^^^^^^^^^^
//!  27 | }
//!  28 | 
//!  29 | var a: {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[27:1]
//!  27 | }
//!  28 | 
//!  29 | var a: {
//!  30 |     foo(public x, private y);
//!     :         ^^^^^^^^
//!  31 |     foo2(private x: number, public y: string);
//!  32 | };
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[27:1]
//!  27 | }
//!  28 | 
//!  29 | var a: {
//!  30 |     foo(public x, private y);
//!     :                   ^^^^^^^^^
//!  31 |     foo2(private x: number, public y: string);
//!  32 | };
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[28:1]
//!  28 | 
//!  29 | var a: {
//!  30 |     foo(public x, private y);
//!  31 |     foo2(private x: number, public y: string);
//!     :          ^^^^^^^^^^^^^^^^^
//!  32 | };
//!  33 | 
//!  34 | var b = {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[28:1]
//!  28 | 
//!  29 | var a: {
//!  30 |     foo(public x, private y);
//!  31 |     foo2(private x: number, public y: string);
//!     :                             ^^^^^^^^^^^^^^^^
//!  32 | };
//!  33 | 
//!  34 | var b = {
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[32:1]
//!  32 | };
//!  33 | 
//!  34 | var b = {
//!  35 |     foo(public x, y) { },
//!     :         ^^^^^^^^
//!  36 |     a: function foo(x: number, private y: string) { },
//!  37 |     b: <T>(public x: T, private y: T) => { }
//!  38 | }
//!     `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!     ,-[33:1]
//!  33 | 
//!  34 | var b = {
//!  35 |     foo(public x, y) { },
//!  36 |     a: function foo(x: number, private y: string) { },
//!     :                                ^^^^^^^^^^^^^^^^^
//!  37 |     b: <T>(public x: T, private y: T) => { }
//!  38 | }
//!     `----
