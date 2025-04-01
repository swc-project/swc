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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
//!     ,-[22:1]
//!  19 | var ResultIsBoolean2 = delete STRING1;
//!  20 | 
//!  21 | // string type literal
//!  22 | var ResultIsBoolean3 = delete "";
//!     :                               ^^
//!  23 | var ResultIsBoolean4 = delete { x: "", y: "" };
//!  24 | var ResultIsBoolean5 = delete { x: "", y: (s: string) => { return s; } };
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[23:1]
//!  20 | 
//!  21 | // string type literal
//!  22 | var ResultIsBoolean3 = delete "";
//!  23 | var ResultIsBoolean4 = delete { x: "", y: "" };
//!     :                               ^^^^^^^^^^^^^^^^
//!  24 | var ResultIsBoolean5 = delete { x: "", y: (s: string) => { return s; } };
//!  25 | 
//!  26 | // string type expressions
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[24:1]
//!  21 | // string type literal
//!  22 | var ResultIsBoolean3 = delete "";
//!  23 | var ResultIsBoolean4 = delete { x: "", y: "" };
//!  24 | var ResultIsBoolean5 = delete { x: "", y: (s: string) => { return s; } };
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  25 | 
//!  26 | // string type expressions
//!  27 | var ResultIsBoolean6 = delete objA.a;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[30:1]
//!  27 | var ResultIsBoolean6 = delete objA.a;
//!  28 | var ResultIsBoolean7 = delete M.n;
//!  29 | var ResultIsBoolean8 = delete STRING1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!     :                               ^^^^^
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (STRING + STRING);
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[31:1]
//!  28 | var ResultIsBoolean7 = delete M.n;
//!  29 | var ResultIsBoolean8 = delete STRING1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!     :                                ^^^^^^^
//!  32 | var ResultIsBoolean11 = delete (STRING + STRING);
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[32:1]
//!  29 | var ResultIsBoolean8 = delete STRING1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (STRING + STRING);
//!     :                                 ^^^^^^^^^^^^^^^
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!  34 | 
//!  35 | // multiple delete  operator
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[33:1]
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (STRING + STRING);
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!     :                                ^^^^^^^^^^^^^^^^
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
//!     ,-[36:1]
//!  33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
//!     :                                ^^^^^^^^^^^^^
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!  38 | 
//!  39 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[37:1]
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!     :                                               ^^^^^^^^^^^^^^^
//!  38 | 
//!  39 | // miss assignment operators
//!  40 | delete "";
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[37:1]
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!     :                                       ^^^^^^^^^^^^^^^^^^^^^^^^
//!  38 | 
//!  39 | // miss assignment operators
//!  40 | delete "";
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[37:1]
//!  34 | 
//!  35 | // multiple delete  operator
//!  36 | var ResultIsBoolean13 = delete delete STRING;
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!     :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  38 | 
//!  39 | // miss assignment operators
//!  40 | delete "";
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[40:1]
//!  37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!  38 | 
//!  39 | // miss assignment operators
//!  40 | delete "";
//!     :        ^^
//!  41 | delete STRING;
//!  42 | delete STRING1;
//!  43 | delete foo();
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
//!   x The operand of a delete operator must be a property reference.
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
//!   x The operand of a delete operator must be a property reference.
//!     ,-[42:1]
//!  39 | // miss assignment operators
//!  40 | delete "";
//!  41 | delete STRING;
//!  42 | delete STRING1;
//!     :        ^^^^^^^
//!  43 | delete foo();
//!  44 | delete objA.a,M.n;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[43:1]
//!  40 | delete "";
//!  41 | delete STRING;
//!  42 | delete STRING1;
//!  43 | delete foo();
//!     :        ^^^^^
//!  44 | delete objA.a,M.n;
//!     `----
