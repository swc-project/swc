//// [namedTupleMembersErrors.ts]
//! 
//!   x Only named exports may use 'export type'.
//!     ,-[12:1]
//!  12 | 
//!  13 | export type Trailing = [first: string, rest: ...string[]]; // dots on element disallowed
//!  14 | 
//!  15 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!     : ^^^^^^^^^^^
//!  16 | 
//!  17 | export type OptRest = [first: string, ...rest?: string[]]; // rest+optional disallowed
//!     `----
//! 
//!   x Expected '{', got 'OptTrailing'
//!     ,-[12:1]
//!  12 | 
//!  13 | export type Trailing = [first: string, rest: ...string[]]; // dots on element disallowed
//!  14 | 
//!  15 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!     :             ^^^^^^^^^^^
//!  16 | 
//!  17 | export type OptRest = [first: string, ...rest?: string[]]; // rest+optional disallowed
//!     `----
