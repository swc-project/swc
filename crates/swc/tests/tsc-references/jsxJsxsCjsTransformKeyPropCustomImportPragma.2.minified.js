//// [preact.tsx]
//! 
//!   x Expected '>', got 'key'
//!    ,----
//!  4 | const a = <div key="foo" {...props}>text</div>;
//!    :                ^^^
//!    `----
//// [react.tsx]
//! 
//!   x Expected '>', got 'key'
//!    ,----
//!  5 | const a2 = <div key="foo" {...props2}>text</div>;
//!    :                 ^^^
//!    `----
