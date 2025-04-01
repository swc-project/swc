//// [incrementOperatorWithUnsupportedBooleanType.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[22:1]
//!  19 | var ResultIsNumber2 = BOOLEAN++;
//!  20 | 
//!  21 | // boolean type literal
//!  22 | var ResultIsNumber3 = ++true;
//!     :                         ^^^^
//!  23 | var ResultIsNumber4 = ++{ x: true, y: false };
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[23:1]
//!  20 | 
//!  21 | // boolean type literal
//!  22 | var ResultIsNumber3 = ++true;
//!  23 | var ResultIsNumber4 = ++{ x: true, y: false };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = true++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[24:1]
//!  21 | // boolean type literal
//!  22 | var ResultIsNumber3 = ++true;
//!  23 | var ResultIsNumber4 = ++{ x: true, y: false };
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!     :                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  25 | 
//!  26 | var ResultIsNumber6 = true++;
//!  27 | var ResultIsNumber7 = { x: true, y: false }++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[26:1]
//!  23 | var ResultIsNumber4 = ++{ x: true, y: false };
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = true++;
//!     :                       ^^^^
//!  27 | var ResultIsNumber7 = { x: true, y: false }++;
//!  28 | var ResultIsNumber8 = { x: true, y: (n: boolean) => { return n; } }++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[27:1]
//!  24 | var ResultIsNumber5 = ++{ x: true, y: (n: boolean) => { return n; } };
//!  25 | 
//!  26 | var ResultIsNumber6 = true++;
//!  27 | var ResultIsNumber7 = { x: true, y: false }++;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^
//!  28 | var ResultIsNumber8 = { x: true, y: (n: boolean) => { return n; } }++;
//!  29 | 
//!  30 | // boolean type expressions
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[28:1]
//!  25 | 
//!  26 | var ResultIsNumber6 = true++;
//!  27 | var ResultIsNumber7 = { x: true, y: false }++;
//!  28 | var ResultIsNumber8 = { x: true, y: (n: boolean) => { return n; } }++;
//!     :                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  29 | 
//!  30 | // boolean type expressions
//!  31 | var ResultIsNumber9 = ++objA.a;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[33:1]
//!  30 | // boolean type expressions
//!  31 | var ResultIsNumber9 = ++objA.a;
//!  32 | var ResultIsNumber10 = ++M.n;
//!  33 | var ResultIsNumber11 = ++foo();
//!     :                          ^^^^^
//!  34 | var ResultIsNumber12 = ++A.foo();
//!  35 | 
//!  36 | var ResultIsNumber13 = foo()++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[34:1]
//!  31 | var ResultIsNumber9 = ++objA.a;
//!  32 | var ResultIsNumber10 = ++M.n;
//!  33 | var ResultIsNumber11 = ++foo();
//!  34 | var ResultIsNumber12 = ++A.foo();
//!     :                          ^^^^^^^
//!  35 | 
//!  36 | var ResultIsNumber13 = foo()++;
//!  37 | var ResultIsNumber14 = A.foo()++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[36:1]
//!  33 | var ResultIsNumber11 = ++foo();
//!  34 | var ResultIsNumber12 = ++A.foo();
//!  35 | 
//!  36 | var ResultIsNumber13 = foo()++;
//!     :                        ^^^^^
//!  37 | var ResultIsNumber14 = A.foo()++;
//!  38 | var ResultIsNumber15 = objA.a++;
//!  39 | var ResultIsNumber16 = M.n++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[37:1]
//!  34 | var ResultIsNumber12 = ++A.foo();
//!  35 | 
//!  36 | var ResultIsNumber13 = foo()++;
//!  37 | var ResultIsNumber14 = A.foo()++;
//!     :                        ^^^^^^^
//!  38 | var ResultIsNumber15 = objA.a++;
//!  39 | var ResultIsNumber16 = M.n++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[42:1]
//!  39 | var ResultIsNumber16 = M.n++;
//!  40 | 
//!  41 | // miss assignment operators
//!  42 | ++true;
//!     :   ^^^^
//!  43 | ++BOOLEAN;
//!  44 | ++foo();
//!  45 | ++objA.a;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[44:1]
//!  41 | // miss assignment operators
//!  42 | ++true;
//!  43 | ++BOOLEAN;
//!  44 | ++foo();
//!     :   ^^^^^
//!  45 | ++objA.a;
//!  46 | ++M.n;
//!  47 | ++objA.a, M.n;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[49:1]
//!  46 | ++M.n;
//!  47 | ++objA.a, M.n;
//!  48 | 
//!  49 | true++;
//!     : ^^^^
//!  50 | BOOLEAN++;
//!  51 | foo()++;
//!  52 | objA.a++;
//!     `----
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[51:1]
//!  48 | 
//!  49 | true++;
//!  50 | BOOLEAN++;
//!  51 | foo()++;
//!     : ^^^^^
//!  52 | objA.a++;
//!  53 | M.n++;
//!  54 | objA.a++, M.n++;
//!     `----
