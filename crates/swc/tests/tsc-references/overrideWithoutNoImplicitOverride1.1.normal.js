//// [overrideWithoutNoImplicitOverride1.ts]
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,-[1:1]
//!  1 | 
//!  2 | export declare class AmbientClass {
//!  3 |     override yadda(): void;
//!    :     ^^^^^^^^
//!  4 | }
//!    `----
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!    ,-[5:1]
//!  5 | 
//!  6 | export class NonAmbientClass {
//!  7 |     override yadda(): void {}
//!    :     ^^^^^^^^
//!  8 | }
//!    `----
