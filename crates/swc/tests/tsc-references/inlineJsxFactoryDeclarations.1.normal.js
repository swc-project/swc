//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  3 | <h></h>
//!    :        ^
//!    `----
//// [other.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  3 | export const prerendered = <h></h>;
//!    :                                    ^
//!    `----
//// [othernoalias.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  3 | export const prerendered2 = <h></h>;
//!    :                                     ^
//!    `----
//// [reacty.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  2 | export const prerendered3 = <h></h>;
//!    :                                     ^
//!    `----
//// [index.tsx]
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  3 | <h></h>
//!    :     ^^^
//!    `----
