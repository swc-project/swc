//// [incrementOperatorWithAnyOtherTypeInvalidOperations.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[34:1]
//!  34 | var ResultIsNumber10 = obj1++;
//!  35 | 
//!  36 | // any type literal
//!  37 | var ResultIsNumber11 = ++{};
//!     :                          ^^
//!  38 | var ResultIsNumber12 = ++null;
//!  39 | var ResultIsNumber13 = ++undefined;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[35:1]
//!  35 | 
//!  36 | // any type literal
//!  37 | var ResultIsNumber11 = ++{};
//!  38 | var ResultIsNumber12 = ++null;
//!     :                          ^^^^
//!  39 | var ResultIsNumber13 = ++undefined;
//!  40 | 
//!  41 | var ResultIsNumber14 = null++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[38:1]
//!  38 | var ResultIsNumber12 = ++null;
//!  39 | var ResultIsNumber13 = ++undefined;
//!  40 | 
//!  41 | var ResultIsNumber14 = null++;
//!     :                        ^^^^
//!  42 | var ResultIsNumber15 = {}++;
//!  43 | var ResultIsNumber16 = undefined++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[39:1]
//!  39 | var ResultIsNumber13 = ++undefined;
//!  40 | 
//!  41 | var ResultIsNumber14 = null++;
//!  42 | var ResultIsNumber15 = {}++;
//!     :                        ^^
//!  43 | var ResultIsNumber16 = undefined++;
//!  44 | 
//!  45 | // any type expressions
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[43:1]
//!  43 | var ResultIsNumber16 = undefined++;
//!  44 | 
//!  45 | // any type expressions
//!  46 | var ResultIsNumber17 = ++foo();
//!     :                          ^^^^^
//!  47 | var ResultIsNumber18 = ++A.foo();
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!  49 | var ResultIsNumber20 = ++(null + null);
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[44:1]
//!  44 | 
//!  45 | // any type expressions
//!  46 | var ResultIsNumber17 = ++foo();
//!  47 | var ResultIsNumber18 = ++A.foo();
//!     :                          ^^^^^^^
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!  49 | var ResultIsNumber20 = ++(null + null);
//!  50 | var ResultIsNumber21 = ++(undefined + undefined);
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[45:1]
//!  45 | // any type expressions
//!  46 | var ResultIsNumber17 = ++foo();
//!  47 | var ResultIsNumber18 = ++A.foo();
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!     :                          ^^^^^^^^^^^^^^^^^^
//!  49 | var ResultIsNumber20 = ++(null + null);
//!  50 | var ResultIsNumber21 = ++(undefined + undefined);
//!  51 | var ResultIsNumber22 = ++obj1.x;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[46:1]
//!  46 | var ResultIsNumber17 = ++foo();
//!  47 | var ResultIsNumber18 = ++A.foo();
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!  49 | var ResultIsNumber20 = ++(null + null);
//!     :                          ^^^^^^^^^^^^^
//!  50 | var ResultIsNumber21 = ++(undefined + undefined);
//!  51 | var ResultIsNumber22 = ++obj1.x;
//!  52 | var ResultIsNumber23 = ++obj1.y;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[47:1]
//!  47 | var ResultIsNumber18 = ++A.foo();
//!  48 | var ResultIsNumber19 = ++(null + undefined);
//!  49 | var ResultIsNumber20 = ++(null + null);
//!  50 | var ResultIsNumber21 = ++(undefined + undefined);
//!     :                          ^^^^^^^^^^^^^^^^^^^^^^^
//!  51 | var ResultIsNumber22 = ++obj1.x;
//!  52 | var ResultIsNumber23 = ++obj1.y;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[51:1]
//!  51 | var ResultIsNumber22 = ++obj1.x;
//!  52 | var ResultIsNumber23 = ++obj1.y;
//!  53 | 
//!  54 | var ResultIsNumber24 = foo()++;
//!     :                        ^^^^^
//!  55 | var ResultIsNumber25 = A.foo()++;
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!  57 | var ResultIsNumber27 = (null + null)++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[52:1]
//!  52 | var ResultIsNumber23 = ++obj1.y;
//!  53 | 
//!  54 | var ResultIsNumber24 = foo()++;
//!  55 | var ResultIsNumber25 = A.foo()++;
//!     :                        ^^^^^^^
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!  57 | var ResultIsNumber27 = (null + null)++;
//!  58 | var ResultIsNumber28 = (undefined + undefined)++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[53:1]
//!  53 | 
//!  54 | var ResultIsNumber24 = foo()++;
//!  55 | var ResultIsNumber25 = A.foo()++;
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!     :                        ^^^^^^^^^^^^^^^^^^
//!  57 | var ResultIsNumber27 = (null + null)++;
//!  58 | var ResultIsNumber28 = (undefined + undefined)++;
//!  59 | var ResultIsNumber29 = obj1.x++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[54:1]
//!  54 | var ResultIsNumber24 = foo()++;
//!  55 | var ResultIsNumber25 = A.foo()++;
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!  57 | var ResultIsNumber27 = (null + null)++;
//!     :                        ^^^^^^^^^^^^^
//!  58 | var ResultIsNumber28 = (undefined + undefined)++;
//!  59 | var ResultIsNumber29 = obj1.x++;
//!  60 | var ResultIsNumber30 = obj1.y++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[55:1]
//!  55 | var ResultIsNumber25 = A.foo()++;
//!  56 | var ResultIsNumber26 = (null + undefined)++;
//!  57 | var ResultIsNumber27 = (null + null)++;
//!  58 | var ResultIsNumber28 = (undefined + undefined)++;
//!     :                        ^^^^^^^^^^^^^^^^^^^^^^^
//!  59 | var ResultIsNumber29 = obj1.x++;
//!  60 | var ResultIsNumber30 = obj1.y++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[64:1]
//!  64 | 
//!  65 | ANY2++;
//!  66 | 
//!  67 | ++ANY1++;
//!     :   ^^^^^^
//!  68 | ++ANY2++;
//!  69 | ++ANY2[0]++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[65:1]
//!  65 | ANY2++;
//!  66 | 
//!  67 | ++ANY1++;
//!  68 | ++ANY2++;
//!     :   ^^^^^^
//!  69 | ++ANY2[0]++;
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[66:1]
//!  66 | 
//!  67 | ++ANY1++;
//!  68 | ++ANY2++;
//!  69 | ++ANY2[0]++;
//!     :   ^^^^^^^^^
//!     `----
