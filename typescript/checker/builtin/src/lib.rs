#![feature(box_syntax)]

extern crate lazy_static;
extern crate swc_atoms;
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ts_checker_macros;

use lazy_static::lazy_static;
use std::{borrow::Cow, sync::RwLock};
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ts_checker_macros::builtin;

// macro_rules! lib {
//     (
//         Names {
//             $($name:ident: $s:expr,)*
//         }
//     ) => {
//         #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
//         pub enum Lib {
//             $(
//                 $name,
//             )*
//         }

//         $(
//             builtin!($name, $s);
//         )*

//         impl Lib {
//             fn body(self) -> &'static TsNamespaceDecl {
//                 match self {
//                     $(
//                         Lib::$name => &*$name,
//                     )*
//                 }
//             }
//         }
//     };
// }

builtin!();

/// Merge definitions
pub fn load(libs: &[Lib]) -> Vec<&'static TsNamespaceDecl> {
    libs.iter().map(|lib| lib.body()).collect()
}
