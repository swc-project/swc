#![feature(box_syntax)]

extern crate lazy_static;
extern crate swc_atoms;
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
extern crate swc_ts_checker_macros;

use lazy_static::lazy_static;
use std::sync::Arc;
use swc_atoms::js_word;
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
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

fn parse_namespace(s: &str) -> TsNamespaceDecl {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let fm = cm.new_source_file(FileName::Anon, s.into());
    let handler = Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(cm.clone()));
    let session = Session { handler: &handler };

    let mut p = Parser::new(
        session,
        Syntax::Typescript(Default::default()),
        SourceFileInput::from(&*fm),
        None,
    );

    let script = p
        .parse_script()
        .map_err(|mut e| {
            e.emit();
            ()
        })
        .expect("failed to parse module");

    TsNamespaceDecl {
        span: DUMMY_SP,
        declare: true,
        global: true,
        id: Ident::new(js_word!(""), DUMMY_SP),
        body: box TsNamespaceBody::TsModuleBlock(TsModuleBlock {
            span: DUMMY_SP,
            body: script.body.into_iter().map(ModuleItem::Stmt).collect(),
        }),
    }
}
