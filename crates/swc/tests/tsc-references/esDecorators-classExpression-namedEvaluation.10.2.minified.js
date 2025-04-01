//// [esDecorators-classExpression-namedEvaluation.10.ts]
//!   x Expression expected
//!     ,-[7:1]
//!   4 | // 10.2.1.3 RS: EvaluateBody
//!   5 | //   Initializer : `=` AssignmentExpression
//!   6 | 
//!   7 | { class C { static x = @dec class {}; } }
//!     :                        ^
//!   8 | { class C { static "x" = @dec class {}; } }
//!   9 | { class C { static 0 = @dec class {}; } }
//!  10 | { class C { static ["x"] = @dec class {}; } }
//!     `----
