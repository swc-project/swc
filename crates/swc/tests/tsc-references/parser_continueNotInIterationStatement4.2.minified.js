//// [parser_continueNotInIterationStatement4.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,-[2:1]
//!  2 | while (true){
//!  3 |   var x = () => {
//!  4 |     continue TWO;
//!    :     ^^^^^^^^^^^^^
//!  5 |   }
//!  6 | }
//!    `----
