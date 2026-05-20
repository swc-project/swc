//// [assignmentCompatWithObjectMembersAccessibility.ts]
//!   x the name `Base` is defined multiple times
//!     ,-[5:1]
//!   2 | 
//!   3 | module TargetIsPublic {
//!   4 |     // targets
//!   5 |     class Base {
//!     :           ^^|^
//!     :             `-- previous definition of `Base` here
//!   6 |         public foo: string;
//!   7 |     }
//!   8 | 
//!   9 |     interface I {
//!  10 |         foo: string;
//!  11 |     }
//!  12 | 
//!  13 |     var a: { foo: string; }
//!  14 |     var b: Base;
//!  15 |     var i: I;
//!  16 | 
//!  17 |     // sources
//!  18 |     class D {
//!  19 |         public foo: string;
//!  20 |     }
//!  21 | 
//!  22 |     class E {
//!  23 |         private foo: string;
//!  24 |     }
//!  25 |     var d: D;
//!  26 |     var e: E;
//!  27 | 
//!  28 |     a = b;
//!  29 |     a = i;
//!  30 |     a = d;
//!  31 |     a = e; // error
//!  32 | 
//!  33 |     b = a;
//!  34 |     b = i;
//!  35 |     b = d;
//!  36 |     b = e; // error
//!  37 | 
//!  38 |     i = a;
//!  39 |     i = b;
//!  40 |     i = d;
//!  41 |     i = e; // error
//!  42 | 
//!  43 |     d = a;
//!  44 |     d = b;
//!  45 |     d = i;
//!  46 |     d = e; // error
//!  47 | 
//!  48 |     e = a; // errror
//!  49 |     e = b; // errror
//!  50 |     e = i; // errror
//!  51 |     e = d; // errror
//!  52 |     e = e; 
//!  53 | 
//!  54 | }
//!  55 | 
//!  56 | module TargetIsPublic {
//!  57 |     // targets
//!  58 |     class Base {
//!     :           ^^|^
//!     :             `-- `Base` redefined here
//!  59 |         private foo: string;
//!  60 |     }
//!     `----
//!   x the name `D` is defined multiple times
//!     ,-[18:1]
//!  15 |     var i: I;
//!  16 | 
//!  17 |     // sources
//!  18 |     class D {
//!     :           |
//!     :           `-- previous definition of `D` here
//!  19 |         public foo: string;
//!  20 |     }
//!  21 | 
//!  22 |     class E {
//!  23 |         private foo: string;
//!  24 |     }
//!  25 |     var d: D;
//!  26 |     var e: E;
//!  27 | 
//!  28 |     a = b;
//!  29 |     a = i;
//!  30 |     a = d;
//!  31 |     a = e; // error
//!  32 | 
//!  33 |     b = a;
//!  34 |     b = i;
//!  35 |     b = d;
//!  36 |     b = e; // error
//!  37 | 
//!  38 |     i = a;
//!  39 |     i = b;
//!  40 |     i = d;
//!  41 |     i = e; // error
//!  42 | 
//!  43 |     d = a;
//!  44 |     d = b;
//!  45 |     d = i;
//!  46 |     d = e; // error
//!  47 | 
//!  48 |     e = a; // errror
//!  49 |     e = b; // errror
//!  50 |     e = i; // errror
//!  51 |     e = d; // errror
//!  52 |     e = e; 
//!  53 | 
//!  54 | }
//!  55 | 
//!  56 | module TargetIsPublic {
//!  57 |     // targets
//!  58 |     class Base {
//!  59 |         private foo: string;
//!  60 |     }
//!  61 | 
//!  62 |     interface I extends Base {
//!  63 |     }
//!  64 | 
//!  65 |     var a: { foo: string; }
//!  66 |     var b: Base;
//!  67 |     var i: I;
//!  68 | 
//!  69 |     // sources
//!  70 |     class D {
//!     :           |
//!     :           `-- `D` redefined here
//!  71 |         public foo: string;
//!  72 |     }
//!     `----
//!   x the name `E` is defined multiple times
//!     ,-[22:1]
//!  19 |         public foo: string;
//!  20 |     }
//!  21 | 
//!  22 |     class E {
//!     :           |
//!     :           `-- previous definition of `E` here
//!  23 |         private foo: string;
//!  24 |     }
//!  25 |     var d: D;
//!  26 |     var e: E;
//!  27 | 
//!  28 |     a = b;
//!  29 |     a = i;
//!  30 |     a = d;
//!  31 |     a = e; // error
//!  32 | 
//!  33 |     b = a;
//!  34 |     b = i;
//!  35 |     b = d;
//!  36 |     b = e; // error
//!  37 | 
//!  38 |     i = a;
//!  39 |     i = b;
//!  40 |     i = d;
//!  41 |     i = e; // error
//!  42 | 
//!  43 |     d = a;
//!  44 |     d = b;
//!  45 |     d = i;
//!  46 |     d = e; // error
//!  47 | 
//!  48 |     e = a; // errror
//!  49 |     e = b; // errror
//!  50 |     e = i; // errror
//!  51 |     e = d; // errror
//!  52 |     e = e; 
//!  53 | 
//!  54 | }
//!  55 | 
//!  56 | module TargetIsPublic {
//!  57 |     // targets
//!  58 |     class Base {
//!  59 |         private foo: string;
//!  60 |     }
//!  61 | 
//!  62 |     interface I extends Base {
//!  63 |     }
//!  64 | 
//!  65 |     var a: { foo: string; }
//!  66 |     var b: Base;
//!  67 |     var i: I;
//!  68 | 
//!  69 |     // sources
//!  70 |     class D {
//!  71 |         public foo: string;
//!  72 |     }
//!  73 | 
//!  74 |     class E {
//!     :           |
//!     :           `-- `E` redefined here
//!  75 |         private foo: string;
//!  76 |     }
//!     `----
