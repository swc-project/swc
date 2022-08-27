//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  3 | export default <h></h>
//!    :                       ^
//!    `----
//// [index.tsx]
//! 
//!   x Unexpected token `regexp literal (h>; , )`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  5 | elem = <h></h>; // Expect assignability error here
//!    :            ^^^^^^
//!    `----
