//// [esDecorators-classExpression-namedEvaluation.8.ts]
//// [a.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 16.2.3.7 RS: Evaluation
//!  4 | //   ExportDeclaration : `export` `default` AssignmentExpression `;` 
//!  5 | 
//!  6 | export default (@dec class { });
//!    :                 ^
//!  7 | 
//!    `----
//// [b.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[6:1]
//!  3 | // 16.2.3.7 RS: Evaluation
//!  4 | //   ExportDeclaration : `export` `default` AssignmentExpression `;` 
//!  5 | 
//!  6 | export default (class { @dec y: any });
//!    :                         ^
//!    `----
