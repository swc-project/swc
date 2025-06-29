//// [deleteOperatorWithAnyOtherType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[25:1]
//!  22 | var objA = new A();
//!  23 | 
//!  24 | // any type var
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!     :                               ^^^^
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!  27 | var ResultIsBoolean3 = delete A;
//!  28 | var ResultIsBoolean4 = delete M;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[26:1]
//!  23 | 
//!  24 | // any type var
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!     :                               ^^^^
//!  27 | var ResultIsBoolean3 = delete A;
//!  28 | var ResultIsBoolean4 = delete M;
//!  29 | var ResultIsBoolean5 = delete obj;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[27:1]
//!  24 | // any type var
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!  27 | var ResultIsBoolean3 = delete A;
//!     :                               ^
//!  28 | var ResultIsBoolean4 = delete M;
//!  29 | var ResultIsBoolean5 = delete obj;
//!  30 | var ResultIsBoolean6 = delete obj1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[28:1]
//!  25 | var ResultIsBoolean1 = delete ANY1;
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!  27 | var ResultIsBoolean3 = delete A;
//!  28 | var ResultIsBoolean4 = delete M;
//!     :                               ^
//!  29 | var ResultIsBoolean5 = delete obj;
//!  30 | var ResultIsBoolean6 = delete obj1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[29:1]
//!  26 | var ResultIsBoolean2 = delete ANY2;
//!  27 | var ResultIsBoolean3 = delete A;
//!  28 | var ResultIsBoolean4 = delete M;
//!  29 | var ResultIsBoolean5 = delete obj;
//!     :                               ^^^
//!  30 | var ResultIsBoolean6 = delete obj1;
//!  31 | 
//!  32 | // any type literal
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[30:1]
//!  27 | var ResultIsBoolean3 = delete A;
//!  28 | var ResultIsBoolean4 = delete M;
//!  29 | var ResultIsBoolean5 = delete obj;
//!  30 | var ResultIsBoolean6 = delete obj1;
//!     :                               ^^^^
//!  31 | 
//!  32 | // any type literal
//!  33 | var ResultIsBoolean7 = delete undefined;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[33:1]
//!  30 | var ResultIsBoolean6 = delete obj1;
//!  31 | 
//!  32 | // any type literal
//!  33 | var ResultIsBoolean7 = delete undefined;
//!     :                               ^^^^^^^^^
//!  34 | var ResultIsBoolean8 = delete null;
//!  35 | 
//!  36 | // any type expressions
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[50:1]
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!     :                                       ^^^
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!  52 | 
//!  53 | // miss assignment operators
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[54:1]
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!  52 | 
//!  53 | // miss assignment operators
//!  54 | delete ANY;
//!     :        ^^^
//!  55 | delete ANY1;
//!  56 | delete ANY2[0];
//!  57 | delete ANY, ANY1;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[55:1]
//!  52 | 
//!  53 | // miss assignment operators
//!  54 | delete ANY;
//!  55 | delete ANY1;
//!     :        ^^^^
//!  56 | delete ANY2[0];
//!  57 | delete ANY, ANY1;
//!  58 | delete obj1.x;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[57:1]
//!  54 | delete ANY;
//!  55 | delete ANY1;
//!  56 | delete ANY2[0];
//!  57 | delete ANY, ANY1;
//!     :        ^^^
//!  58 | delete obj1.x;
//!  59 | delete obj1.y;
//!  60 | delete objA.a;
//!     `----
