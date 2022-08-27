//// [file.tsx]
//! 
//!   x Unknown regular expression flags.
//!     ,----
//!  10 | <div>word <code>code</code> word</div>;
//!     :                      ^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,----
//!  10 | <div>word <code>code</code> word</div>;
//!     :                                       ^
//!     `----
