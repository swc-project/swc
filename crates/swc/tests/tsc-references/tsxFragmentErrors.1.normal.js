//// [file.tsx]
//! 
//!   x Expression expected
//!     ,----
//!  10 | <>hi</div> // Error
//!     :  ^
//!     `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,----
//!  12 | <>eof   // Error
//!     :  ^
//!     `----
