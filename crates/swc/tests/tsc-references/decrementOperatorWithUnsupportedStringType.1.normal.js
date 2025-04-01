//// [decrementOperatorWithUnsupportedStringType.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[25:1]
//!  22 | var ResultIsNumber4 = STRING1--;
//!  23 | 
//!  24 | // string type literal
//!  25 | var ResultIsNumber5 = --"";
//!     :                         ^^
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[26:1]
//!  23 | 
//!  24 | // string type literal
//!  25 | var ResultIsNumber5 = --"";
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!     :                         ^^^^^^^^^^^^^^^^
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[27:1]
//!  24 | // string type literal
//!  25 | var ResultIsNumber5 = --"";
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[29:1]
//!  26 | var ResultIsNumber6 = --{ x: "", y: "" };
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!     :                       ^^
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[30:1]
//!  27 | var ResultIsNumber7 = --{ x: "", y: (s: string) => { return s; } };
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!     :                       ^^^^^^^^^^^^^^^^
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!  32 | 
//!  33 | // string type expressions
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[31:1]
//!  28 | 
//!  29 | var ResultIsNumber8 = ""--;
//!  30 | var ResultIsNumber9 = { x: "", y: "" }--;
//!  31 | var ResultIsNumber10 = { x: "", y: (s: string) => { return s; } }--;
//!     :                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  32 | 
//!  33 | // string type expressions
//!  34 | var ResultIsNumber11 = --objA.a;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[37:1]
//!  34 | var ResultIsNumber11 = --objA.a;
//!  35 | var ResultIsNumber12 = --M.n;
//!  36 | var ResultIsNumber13 = --STRING1[0];
//!  37 | var ResultIsNumber14 = --foo();
//!     :                          ^^^^^
//!  38 | var ResultIsNumber15 = --A.foo();
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[38:1]
//!  35 | var ResultIsNumber12 = --M.n;
//!  36 | var ResultIsNumber13 = --STRING1[0];
//!  37 | var ResultIsNumber14 = --foo();
//!  38 | var ResultIsNumber15 = --A.foo();
//!     :                          ^^^^^^^
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!  40 | 
//!  41 | var ResultIsNumber17 = objA.a--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[39:1]
//!  36 | var ResultIsNumber13 = --STRING1[0];
//!  37 | var ResultIsNumber14 = --foo();
//!  38 | var ResultIsNumber15 = --A.foo();
//!  39 | var ResultIsNumber16 = --(STRING + STRING);
//!     :                          ^^^^^^^^^^^^^^^^^
//!  40 | 
//!  41 | var ResultIsNumber17 = objA.a--;
//!  42 | var ResultIsNumber18 = M.n--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[44:1]
//!  41 | var ResultIsNumber17 = objA.a--;
//!  42 | var ResultIsNumber18 = M.n--;
//!  43 | var ResultIsNumber19 = STRING1[0]--;
//!  44 | var ResultIsNumber20 = foo()--;
//!     :                        ^^^^^
//!  45 | var ResultIsNumber21 = A.foo()--;
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[45:1]
//!  42 | var ResultIsNumber18 = M.n--;
//!  43 | var ResultIsNumber19 = STRING1[0]--;
//!  44 | var ResultIsNumber20 = foo()--;
//!  45 | var ResultIsNumber21 = A.foo()--;
//!     :                        ^^^^^^^
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!  47 | 
//!  48 | // miss assignment operators
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[46:1]
//!  43 | var ResultIsNumber19 = STRING1[0]--;
//!  44 | var ResultIsNumber20 = foo()--;
//!  45 | var ResultIsNumber21 = A.foo()--;
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!     :                        ^^^^^^^^^^^^^^^^^
//!  47 | 
//!  48 | // miss assignment operators
//!  49 | --"";
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[49:1]
//!  46 | var ResultIsNumber22 = (STRING + STRING)--;
//!  47 | 
//!  48 | // miss assignment operators
//!  49 | --"";
//!     :   ^^
//!  50 | --STRING;
//!  51 | --STRING1;
//!  52 | --STRING1[0];
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[53:1]
//!  50 | --STRING;
//!  51 | --STRING1;
//!  52 | --STRING1[0];
//!  53 | --foo();
//!     :   ^^^^^
//!  54 | --objA.a;
//!  55 | --M.n;
//!  56 | --objA.a, M.n;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[58:1]
//!  55 | --M.n;
//!  56 | --objA.a, M.n;
//!  57 | 
//!  58 | ""--;
//!     : ^^
//!  59 | STRING--;
//!  60 | STRING1--;
//!  61 | STRING1[0]--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[62:1]
//!  59 | STRING--;
//!  60 | STRING1--;
//!  61 | STRING1[0]--;
//!  62 | foo()--;
//!     : ^^^^^
//!  63 | objA.a--;
//!  64 | M.n--;
//!  65 | objA.a--, M.n--;
//!     `----
