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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
//!     ,-[34:1]
//!  31 | 
//!  32 | // any type literal
//!  33 | var ResultIsBoolean7 = delete undefined;
//!  34 | var ResultIsBoolean8 = delete null;
//!     :                               ^^^^
//!  35 | 
//!  36 | // any type expressions
//!  37 | var ResultIsBoolean9 = delete ANY2[0];
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[42:1]
//!  39 | var ResultIsBoolean11 = delete obj1.y;
//!  40 | var ResultIsBoolean12 = delete objA.a;
//!  41 | var ResultIsBoolean13 = delete M.n;
//!  42 | var ResultIsBoolean14 = delete foo();
//!     :                                ^^^^^
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[43:1]
//!  40 | var ResultIsBoolean12 = delete objA.a;
//!  41 | var ResultIsBoolean13 = delete M.n;
//!  42 | var ResultIsBoolean14 = delete foo();
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!     :                                ^^^^^^^
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[44:1]
//!  41 | var ResultIsBoolean13 = delete M.n;
//!  42 | var ResultIsBoolean14 = delete foo();
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!     :                                 ^^^^^^^^^^
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[45:1]
//!  42 | var ResultIsBoolean14 = delete foo();
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!     :                                 ^^^^^^^^^^^^^^^^
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[46:1]
//!  43 | var ResultIsBoolean15 = delete A.foo();
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!     :                                 ^^^^^^^^^^^
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!  48 | 
//!  49 | // multiple delete  operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[47:1]
//!  44 | var ResultIsBoolean16 = delete (ANY + ANY1);
//!  45 | var ResultIsBoolean17 = delete (null + undefined);
//!  46 | var ResultIsBoolean18 = delete (null + null);
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!     :                                 ^^^^^^^^^^^^^^^^^^^^^
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
//!     ,-[50:1]
//!  47 | var ResultIsBoolean19 = delete (undefined + undefined);
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!     :                                ^^^^^^^^^^
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!  52 | 
//!  53 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[51:1]
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                               ^^^^^^^^^^
//!  52 | 
//!  53 | // miss assignment operators
//!  54 | delete ANY;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[51:1]
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                       ^^^^^^^^^^^^^^^^^^^
//!  52 | 
//!  53 | // miss assignment operators
//!  54 | delete ANY;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[51:1]
//!  48 | 
//!  49 | // multiple delete  operators
//!  50 | var ResultIsBoolean20 = delete delete ANY;
//!  51 | var ResultIsBoolean21 = delete delete delete (ANY + ANY1);
//!     :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  52 | 
//!  53 | // miss assignment operators
//!  54 | delete ANY;
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
