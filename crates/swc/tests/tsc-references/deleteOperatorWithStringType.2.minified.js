//// [deleteOperatorWithStringType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[18:1]
//!  15 | var objA = new A();
//!  16 | 
//!  17 | // string type var
//!  18 | var ResultIsBoolean1 = delete STRING;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete STRING1;
//!  20 | 
//!  21 | // string type literal
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[19:1]
//!  16 | 
//!  17 | // string type var
//!  18 | var ResultIsBoolean1 = delete STRING;
//!  19 | var ResultIsBoolean2 = delete STRING1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // string type literal
//!  22 | var ResultIsBoolean3 = delete "";
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[36:1]
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
//!     :                                       ^^^^^^
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!  38 | 
//!  39 | // miss assignment operators
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[41:1]
//!  38 | 
//!  39 | // miss assignment operators
//!  40 | delete "";
//!  41 | delete STRING;
//!     :        ^^^^^^
//!  42 | delete STRING1;
//!  43 | delete foo();
//!  44 | delete objA.a,M.n;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[42:1]
//!  39 | // miss assignment operators
//!  40 | delete "";
//!  41 | delete STRING;
//!  42 | delete STRING1;
//!     :        ^^^^^^^
//!  43 | delete foo();
//!  44 | delete objA.a,M.n;
//!     `----
