//// [tsxExternalModuleEmit1.tsx]
"use strict";
//// [react.d.ts]
"use strict";
//// [app.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  9 | return <Button />;
//!    :                ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  9 | return <Button />;
//!    :                 ^
//!    `----
//// [button.tsx]
//! 
//!   x Expected ';', got 'button'
//!    ,----
//!  6 | return <button>Some button</button>;
//!    :                     ^^^^^^
//!    `----
