//// [parser_duplicateLabel2.ts]
//! 
//!   x Label target is already declared
//!    ,-[1:1]
//!  1 | target:
//!  2 | while (true) {
//!  3 |   target:
//!    :   ^^^^^^
//!  4 |   while (true) {
//!  5 |   }
//!  6 | }
//!    `----
