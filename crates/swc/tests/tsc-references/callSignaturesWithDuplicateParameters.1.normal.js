//// [callSignaturesWithDuplicateParameters.ts]
//!   x the name `x` is bound more than once in this parameter list
//!    ,-[3:1]
//!  1 | // Duplicate parameter names are always an error
//!  2 | 
//!  3 | function foo(x, x) { }
//!    :              |  |
//!    :              |  `-- used as parameter more than once
//!    :              `-- previous definition here
//!  4 | var f = function foo(x, x) { }
//!  5 | var f2 = function (x, x) { }
//!  6 | var f3 = (x, x) => { }
//!    `----
//!   x the name `x` is bound more than once in this parameter list
//!    ,-[4:1]
//!  1 | // Duplicate parameter names are always an error
//!  2 | 
//!  3 | function foo(x, x) { }
//!  4 | var f = function foo(x, x) { }
//!    :                      |  |
//!    :                      |  `-- used as parameter more than once
//!    :                      `-- previous definition here
//!  5 | var f2 = function (x, x) { }
//!  6 | var f3 = (x, x) => { }
//!  7 | var f4 = <T>(x: T, x: T) => { }
//!    `----
//!   x the name `x` is bound more than once in this parameter list
//!    ,-[5:1]
//!  2 | 
//!  3 | function foo(x, x) { }
//!  4 | var f = function foo(x, x) { }
//!  5 | var f2 = function (x, x) { }
//!    :                    |  |
//!    :                    |  `-- used as parameter more than once
//!    :                    `-- previous definition here
//!  6 | var f3 = (x, x) => { }
//!  7 | var f4 = <T>(x: T, x: T) => { }
//!    `----
//!   x the name `x` is bound more than once in this parameter list
//!    ,-[6:1]
//!  3 | function foo(x, x) { }
//!  4 | var f = function foo(x, x) { }
//!  5 | var f2 = function (x, x) { }
//!  6 | var f3 = (x, x) => { }
//!    :           |  |
//!    :           |  `-- used as parameter more than once
//!    :           `-- previous definition here
//!  7 | var f4 = <T>(x: T, x: T) => { }
//!  8 | 
//!  9 | function foo2(x: string, x: number) { }
//!    `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[7:1]
//!   4 | var f = function foo(x, x) { }
//!   5 | var f2 = function (x, x) { }
//!   6 | var f3 = (x, x) => { }
//!   7 | var f4 = <T>(x: T, x: T) => { }
//!     :              ^^|^  ^^|^
//!     :                |     `-- used as parameter more than once
//!     :                `-- previous definition here
//!   8 | 
//!   9 | function foo2(x: string, x: number) { }
//!  10 | var f5 = function foo(x: string, x: number) { }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[9:1]
//!   6 | var f3 = (x, x) => { }
//!   7 | var f4 = <T>(x: T, x: T) => { }
//!   8 | 
//!   9 | function foo2(x: string, x: number) { }
//!     :               |          |
//!     :               |          `-- used as parameter more than once
//!     :               `-- previous definition here
//!  10 | var f5 = function foo(x: string, x: number) { }
//!  11 | var f6 = function (x: string, x: number) { }
//!  12 | var f7 = (x: string, x: number) => { }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[10:1]
//!   7 | var f4 = <T>(x: T, x: T) => { }
//!   8 | 
//!   9 | function foo2(x: string, x: number) { }
//!  10 | var f5 = function foo(x: string, x: number) { }
//!     :                       |          |
//!     :                       |          `-- used as parameter more than once
//!     :                       `-- previous definition here
//!  11 | var f6 = function (x: string, x: number) { }
//!  12 | var f7 = (x: string, x: number) => { }
//!  13 | var f8 = <T>(x: T, y: T) => { }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[11:1]
//!   8 | 
//!   9 | function foo2(x: string, x: number) { }
//!  10 | var f5 = function foo(x: string, x: number) { }
//!  11 | var f6 = function (x: string, x: number) { }
//!     :                    |          |
//!     :                    |          `-- used as parameter more than once
//!     :                    `-- previous definition here
//!  12 | var f7 = (x: string, x: number) => { }
//!  13 | var f8 = <T>(x: T, y: T) => { }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[12:1]
//!   9 | function foo2(x: string, x: number) { }
//!  10 | var f5 = function foo(x: string, x: number) { }
//!  11 | var f6 = function (x: string, x: number) { }
//!  12 | var f7 = (x: string, x: number) => { }
//!     :           ^^^^|^^^^  ^^^^|^^^^
//!     :               |          `-- used as parameter more than once
//!     :               `-- previous definition here
//!  13 | var f8 = <T>(x: T, y: T) => { }
//!  14 | 
//!  15 | class C {
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[16:1]
//!  13 | var f8 = <T>(x: T, y: T) => { }
//!  14 | 
//!  15 | class C {
//!  16 |     foo(x, x) { }
//!     :         |  |
//!     :         |  `-- used as parameter more than once
//!     :         `-- previous definition here
//!  17 |     foo2(x: number, x: string) { }
//!  18 |     foo3<T>(x: T, x: T) { }
//!  19 | }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[17:1]
//!  14 | 
//!  15 | class C {
//!  16 |     foo(x, x) { }
//!  17 |     foo2(x: number, x: string) { }
//!     :          |          |
//!     :          |          `-- used as parameter more than once
//!     :          `-- previous definition here
//!  18 |     foo3<T>(x: T, x: T) { }
//!  19 | }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[18:1]
//!  15 | class C {
//!  16 |     foo(x, x) { }
//!  17 |     foo2(x: number, x: string) { }
//!  18 |     foo3<T>(x: T, x: T) { }
//!     :             |     |
//!     :             |     `-- used as parameter more than once
//!     :             `-- previous definition here
//!  19 | }
//!  20 | 
//!  21 | interface I {
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[35:1]
//!  32 | };
//!  33 | 
//!  34 | var b = {
//!  35 |     foo(x, x) { },
//!     :         |  |
//!     :         |  `-- used as parameter more than once
//!     :         `-- previous definition here
//!  36 |     a: function foo(x: number, x: string) { },
//!  37 |     b: <T>(x: T, x: T) => { }
//!  38 | }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[36:1]
//!  33 | 
//!  34 | var b = {
//!  35 |     foo(x, x) { },
//!  36 |     a: function foo(x: number, x: string) { },
//!     :                     |          |
//!     :                     |          `-- used as parameter more than once
//!     :                     `-- previous definition here
//!  37 |     b: <T>(x: T, x: T) => { }
//!  38 | }
//!     `----
//!   x the name `x` is bound more than once in this parameter list
//!     ,-[37:1]
//!  34 | var b = {
//!  35 |     foo(x, x) { },
//!  36 |     a: function foo(x: number, x: string) { },
//!  37 |     b: <T>(x: T, x: T) => { }
//!     :            ^^|^  ^^|^
//!     :              |     `-- used as parameter more than once
//!     :              `-- previous definition here
//!  38 | }
//!     `----
