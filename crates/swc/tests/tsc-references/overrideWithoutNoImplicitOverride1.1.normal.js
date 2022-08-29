//// [overrideWithoutNoImplicitOverride1.ts]
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,----
//!  3 | override yadda(): void;
//!    : ^^^^^^^^
//!    `----
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,----
//!  7 | override yadda(): void {}
//!    : ^^^^^^^^
//!    `----
