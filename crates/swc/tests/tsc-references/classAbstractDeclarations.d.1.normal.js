//// [classAbstractDeclarations.d.ts]
//! 
//!   x An implementation cannot be declared in ambient contexts
//!    ,----
//!  2 | abstract constructor() {}
//!    :                        ^
//!    `----
//! 
//!   x `abstract` modifier can only appear on a class or method declaration
//!    ,----
//!  2 | abstract constructor() {}
//!    : ^^^^^^^^
//!    `----
