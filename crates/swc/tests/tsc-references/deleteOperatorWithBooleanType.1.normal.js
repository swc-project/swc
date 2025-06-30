//// [deleteOperatorWithBooleanType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[17:1]
//!  14 | var objA = new A();
//!  15 | 
//!  16 | // boolean type var
//!  17 | var ResultIsBoolean1 = delete BOOLEAN;
//!     :                               ^^^^^^^
//!  18 | 
//!  19 | // boolean type literal
//!  20 | var ResultIsBoolean2 = delete true;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[30:1]
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!  28 | 
//!  29 | // multiple delete  operator
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!     :                                      ^^^^^^^
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[34:1]
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!  34 | delete BOOLEAN;
//!     :        ^^^^^^^
//!  35 | delete foo();
//!  36 | delete true, false;
//!  37 | delete objA.a;
//!     `----
