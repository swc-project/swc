//// [namedTupleMembersErrors.ts]
//! 
//!   x Only named exports may use 'export type'.
//!     ,----
//!  15 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!     : ^^^^^^^^^^^
//!     `----
//! 
//!   x Expected '{', got 'OptTrailing'
//!     ,----
//!  15 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!     :             ^^^^^^^^^^^
//!     `----
