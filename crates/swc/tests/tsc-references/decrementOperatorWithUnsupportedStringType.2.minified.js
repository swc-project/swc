//// [decrementOperatorWithUnsupportedStringType.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[23:1]
//!  23 | 
//!  24 | // string type literal
//!  25 | var ResultIsNumber5 = --"";
//!     :                         ^^
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[24:1]
//!  24 | // string type literal
//!  25 | var ResultIsNumber5 = --"";
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!     :                         ^^^^^^^^^^^^^^^^
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[25:1]
//!  25 | var ResultIsNumber5 = --"";
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[27:1]
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!     :                       ^^
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[28:1]
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!     :                       ^^^^^^^^^^^^^^^^
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[29:1]
//!  29 | var ResultIsNumber8 = ""--;
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!     :                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  32 | 
//!  33 | // string type expressions
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[35:1]
//!  35 | var ResultIsNumber12 = --M.n;
//!  36 | var ResultIsNumber13 = --STRING1[0];
//!  37 | var ResultIsNumber14 = --foo();
//!     :                          ^^^^^
//!  38 | var ResultIsNumber15 = --A.foo();
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[36:1]
//!  36 | var ResultIsNumber13 = --STRING1[0];
//!  37 | var ResultIsNumber14 = --foo();
//!  38 | var ResultIsNumber15 = --A.foo();
//!     :                          ^^^^^^^
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[37:1]
//!  37 | var ResultIsNumber14 = --foo();
//!  38 | var ResultIsNumber15 = --A.foo();
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!     :                          ^^^^^^^^^^^^^^^^^
//!  40 | 
//!  41 | var ResultIsNumber17 = objA.a--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[42:1]
//!  42 | var ResultIsNumber18 = M.n--;
//!  43 | var ResultIsNumber19 = STRING1[0]--;
//!  44 | var ResultIsNumber20 = foo()--;
//!     :                        ^^^^^
//!  45 | var ResultIsNumber21 = A.foo()--;
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[43:1]
//!  43 | var ResultIsNumber19 = STRING1[0]--;
//!  44 | var ResultIsNumber20 = foo()--;
//!  45 | var ResultIsNumber21 = A.foo()--;
//!     :                        ^^^^^^^
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[44:1]
//!  44 | var ResultIsNumber20 = foo()--;
//!  45 | var ResultIsNumber21 = A.foo()--;
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!     :                        ^^^^^^^^^^^^^^^^^
//!  47 | 
//!  48 | // miss assignment operators
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[47:1]
//!  47 | 
//!  48 | // miss assignment operators
//!  49 | --"";
//!     :   ^^
//!  50 | --STRING;
//!  51 | --STRING1;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[51:1]
//!  51 | --STRING1;
//!  52 | --STRING1[0];
//!  53 | --foo();
//!     :   ^^^^^
//!  54 | --objA.a;
//!  55 | --M.n;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[56:1]
//!  56 | --objA.a, M.n;
//!  57 | 
//!  58 | ""--;
//!     : ^^
//!  59 | STRING--;
//!  60 | STRING1--;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[60:1]
//!  60 | STRING1--;
//!  61 | STRING1[0]--;
//!  62 | foo()--;
//!     : ^^^^^
//!  63 | objA.a--;
//!  64 | M.n--;
//!     `----
