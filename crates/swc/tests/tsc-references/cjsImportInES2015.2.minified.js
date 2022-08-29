//// [cjsImportInES2015.ts]
//// [/project/node_modules/cjs-dep/index.d.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = SpecialError;
//!    : ^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [/project/index.ts]
export { };
