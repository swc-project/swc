//// [deleteOperatorWithNumberType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[18:1]
//!  15 | var objA = new A();
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!  20 | 
//!  21 | // number type literal
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[19:1]
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[35:1]
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                       ^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[40:1]
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!     :        ^^^^^^
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!  43 | delete objA.a;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[41:1]
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     :        ^^^^^^^
//!  42 | delete foo();
//!  43 | delete objA.a;
//!  44 | delete M.n;
//!     `----
