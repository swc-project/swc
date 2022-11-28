//// [file.tsx]
//! 
//!   x Expression expected
//!     ,-[7:1]
//!   7 | }
//!   8 | declare var React: any;
//!   9 | 
//!  10 | <>hi</div> // Error
//!     :  ^
//!  11 | 
//!  12 | <>eof   // Error
//!     `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,-[10:1]
//!  10 | <>hi</div> // Error
//!  11 | 
//!  12 | <>eof   // Error
//!     :  ^
//!     `----
