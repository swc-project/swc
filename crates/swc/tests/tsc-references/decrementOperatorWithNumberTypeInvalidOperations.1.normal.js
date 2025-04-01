//// [decrementOperatorWithNumberTypeInvalidOperations.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[22:1]
//!  19 | var ResultIsNumber2 = NUMBER1--;
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsNumber3 = --1;
//!     :                         ^
//!  23 | var ResultIsNumber4 = --{ x: 1, y: 2};
//!  24 | var ResultIsNumber5 = --{ x: 1, y: (n: number) => { return n; } };
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[23:1]
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsNumber3 = --1;
//!  23 | var ResultIsNumber4 = --{ x: 1, y: 2};
//!     :                         ^^^^^^^^^^^^^
//!  24 | var ResultIsNumber5 = --{ x: 1, y: (n: number) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = 1--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[24:1]
//!  21 | // number type literal
//!  22 | var ResultIsNumber3 = --1;
//!  23 | var ResultIsNumber4 = --{ x: 1, y: 2};
//!  24 | var ResultIsNumber5 = --{ x: 1, y: (n: number) => { return n; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  25 | 
//!  26 | var ResultIsNumber6 = 1--;
//!  27 | var ResultIsNumber7 = { x: 1, y: 2 }--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[26:1]
//!  23 | var ResultIsNumber4 = --{ x: 1, y: 2};
//!  24 | var ResultIsNumber5 = --{ x: 1, y: (n: number) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = 1--;
//!     :                       ^
//!  27 | var ResultIsNumber7 = { x: 1, y: 2 }--;
//!  28 | var ResultIsNumber8 = { x: 1, y: (n: number) => { return n; } }--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[27:1]
//!  24 | var ResultIsNumber5 = --{ x: 1, y: (n: number) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = 1--;
//!  27 | var ResultIsNumber7 = { x: 1, y: 2 }--;
//!     :                       ^^^^^^^^^^^^^^
//!  28 | var ResultIsNumber8 = { x: 1, y: (n: number) => { return n; } }--;
//!  29 | 
//!  30 | // number type expressions
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[28:1]
//!  25 | 
//!  26 | var ResultIsNumber6 = 1--;
//!  27 | var ResultIsNumber7 = { x: 1, y: 2 }--;
//!  28 | var ResultIsNumber8 = { x: 1, y: (n: number) => { return n; } }--;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  29 | 
//!  30 | // number type expressions
//!  31 | var ResultIsNumber9 = --foo();
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[31:1]
//!  28 | var ResultIsNumber8 = { x: 1, y: (n: number) => { return n; } }--;
//!  29 | 
//!  30 | // number type expressions
//!  31 | var ResultIsNumber9 = --foo();
//!     :                         ^^^^^
//!  32 | var ResultIsNumber10 = --A.foo();
//!  33 | var ResultIsNumber11 = --(NUMBER + NUMBER);
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[32:1]
//!  29 | 
//!  30 | // number type expressions
//!  31 | var ResultIsNumber9 = --foo();
//!  32 | var ResultIsNumber10 = --A.foo();
//!     :                          ^^^^^^^
//!  33 | var ResultIsNumber11 = --(NUMBER + NUMBER);
//!  34 | 
//!  35 | var ResultIsNumber12 = foo()--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[33:1]
//!  30 | // number type expressions
//!  31 | var ResultIsNumber9 = --foo();
//!  32 | var ResultIsNumber10 = --A.foo();
//!  33 | var ResultIsNumber11 = --(NUMBER + NUMBER);
//!     :                          ^^^^^^^^^^^^^^^^^
//!  34 | 
//!  35 | var ResultIsNumber12 = foo()--;
//!  36 | var ResultIsNumber13 = A.foo()--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[35:1]
//!  32 | var ResultIsNumber10 = --A.foo();
//!  33 | var ResultIsNumber11 = --(NUMBER + NUMBER);
//!  34 | 
//!  35 | var ResultIsNumber12 = foo()--;
//!     :                        ^^^^^
//!  36 | var ResultIsNumber13 = A.foo()--;
//!  37 | var ResultIsNumber14 = (NUMBER + NUMBER)--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[36:1]
//!  33 | var ResultIsNumber11 = --(NUMBER + NUMBER);
//!  34 | 
//!  35 | var ResultIsNumber12 = foo()--;
//!  36 | var ResultIsNumber13 = A.foo()--;
//!     :                        ^^^^^^^
//!  37 | var ResultIsNumber14 = (NUMBER + NUMBER)--;
//!  38 | 
//!  39 | // miss assignment operator
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[37:1]
//!  34 | 
//!  35 | var ResultIsNumber12 = foo()--;
//!  36 | var ResultIsNumber13 = A.foo()--;
//!  37 | var ResultIsNumber14 = (NUMBER + NUMBER)--;
//!     :                        ^^^^^^^^^^^^^^^^^
//!  38 | 
//!  39 | // miss assignment operator
//!  40 | --1;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[40:1]
//!  37 | var ResultIsNumber14 = (NUMBER + NUMBER)--;
//!  38 | 
//!  39 | // miss assignment operator
//!  40 | --1;
//!     :   ^
//!  41 | --NUMBER1;
//!  42 | --foo();
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[42:1]
//!  39 | // miss assignment operator
//!  40 | --1;
//!  41 | --NUMBER1;
//!  42 | --foo();
//!     :   ^^^^^
//!  43 | 
//!  44 | 1--;
//!  45 | NUMBER1--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[44:1]
//!  41 | --NUMBER1;
//!  42 | --foo();
//!  43 | 
//!  44 | 1--;
//!     : ^
//!  45 | NUMBER1--;
//!  46 | foo()--;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[46:1]
//!  43 | 
//!  44 | 1--;
//!  45 | NUMBER1--;
//!  46 | foo()--;
//!     : ^^^^^
//!     `----
