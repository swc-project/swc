//// [autoAccessorNoUseDefineForClassFields.ts]
//// [file1.ts]
//! 
//!   x Unexpected token `x`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | // https://github.com/microsoft/TypeScript/issues/51528
//!  2 | class C1 {
//!  3 |     static accessor x = 0;
//!    :                     ^
//!  4 | }
//!  5 | 
//!    `----
//// [file2.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C2 {
//!  2 |     static accessor #x = 0;
//!    :                     ^
//!  3 | }
//!  4 | 
//!    `----
//// [file3.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C3 {
//!  2 |     static accessor #x = 0;
//!    :                     ^
//!  3 |     accessor #y = 0;
//!  4 | }
//!    `----
//// [file3.ts]
//! 
//!   x Unexpected token `x`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C3 {
//!  2 |     accessor x = 0;
//!    :              ^
//!  3 | }
//!  4 | 
//!    `----
//// [file4.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C4 {
//!  2 |     accessor #x = 0;
//!    :              ^
//!  3 | }
//!  4 | 
//!    `----
//// [file5.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C5 {
//!  2 |     x = 0;
//!  3 |     accessor #x = 1;
//!    :              ^
//!  4 | }
//!  5 | 
//!    `----
//// [file6.ts]
//! 
//!   x Unexpected token `#`. Expected * for generator, private key, identifier or async
//!    ,-[1:1]
//!  1 | class C6 {
//!  2 |     accessor #x = 0;
//!    :              ^
//!  3 |     x = 1;
//!  4 | }
//!    `----
