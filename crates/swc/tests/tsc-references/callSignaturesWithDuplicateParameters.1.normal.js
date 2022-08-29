//// [callSignaturesWithDuplicateParameters.ts]
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  3 | function foo(x, x) { }
//!    :              |  |
//!    :              |  `-- used as parameter more than once
//!    :              `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  4 | var f = function foo(x, x) { }
//!    :                      |  |
//!    :                      |  `-- used as parameter more than once
//!    :                      `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  5 | var f2 = function (x, x) { }
//!    :                    |  |
//!    :                    |  `-- used as parameter more than once
//!    :                    `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  6 | var f3 = (x, x) => { }
//!    :           |  |
//!    :           |  `-- used as parameter more than once
//!    :           `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  7 | var f4 = <T>(x: T, x: T) => { }
//!    :              ^^|^  ^^|^
//!    :                |     `-- used as parameter more than once
//!    :                `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!    ,----
//!  9 | function foo2(x: string, x: number) { }
//!    :               ^^^^|^^^^  ^^^^|^^^^
//!    :                   |          `-- used as parameter more than once
//!    :                   `-- previous definition here
//!    `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  10 | var f5 = function foo(x: string, x: number) { }
//!     :                       ^^^^|^^^^  ^^^^|^^^^
//!     :                           |          `-- used as parameter more than once
//!     :                           `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  11 | var f6 = function (x: string, x: number) { }
//!     :                    ^^^^|^^^^  ^^^^|^^^^
//!     :                        |          `-- used as parameter more than once
//!     :                        `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  12 | var f7 = (x: string, x: number) => { }
//!     :           ^^^^|^^^^  ^^^^|^^^^
//!     :               |          `-- used as parameter more than once
//!     :               `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  16 | foo(x, x) { }
//!     :     |  |
//!     :     |  `-- used as parameter more than once
//!     :     `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  17 | foo2(x: number, x: string) { }
//!     :      ^^^^|^^^^  ^^^^|^^^^
//!     :          |          `-- used as parameter more than once
//!     :          `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  18 | foo3<T>(x: T, x: T) { }
//!     :         ^^|^  ^^|^
//!     :           |     `-- used as parameter more than once
//!     :           `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  35 | foo(x, x) { },
//!     :     |  |
//!     :     |  `-- used as parameter more than once
//!     :     `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  36 | a: function foo(x: number, x: string) { },
//!     :                 ^^^^|^^^^  ^^^^|^^^^
//!     :                     |          `-- used as parameter more than once
//!     :                     `-- previous definition here
//!     `----
//! 
//!   x the name `x` is bound more than once in this parameter list
//!     ,----
//!  37 | b: <T>(x: T, x: T) => { }
//!     :        ^^|^  ^^|^
//!     :          |     `-- used as parameter more than once
//!     :          `-- previous definition here
//!     `----
