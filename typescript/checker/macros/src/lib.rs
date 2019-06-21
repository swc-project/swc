#[macro_use]
extern crate swc_common;
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_ecma_parser;
extern crate swc_macros_common;
extern crate syn;

use quote::{quote, quote_spanned};
use std::{fs::File, io::Read, path::Path, sync::Arc};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use syn::{
    parse::{Parse, ParseStream, Result},
    parse_macro_input,
    spanned::Spanned,
    Expr, Ident, LitStr, Token, Type, Visibility,
};

#[proc_macro]
pub fn builtin(item: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let lit: LitStr = parse_macro_input!(item as LitStr);
    let path = lit.value();

    let module = swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let session = Session { handler: &handler };

        // Real usage
        // let fm = cm
        //     .load_file(Path::new("test.js"))
        //     .expect("failed to load test.js");

        let dir_str =
            ::std::env::var("CARGO_MANIFEST_DIR").expect("failed to read CARGO_MANIFEST_DIR");
        let dir = Path::new(&dir_str);
        let fm = cm.load_file(&dir.join(path)).expect("failed to load file");

        let mut parser = Parser::new(
            session,
            Syntax::Typescript(Default::default()),
            SourceFileInput::from(&*fm),
            None, // Disable comments
        );

        let module = parser
            .parse_script()
            .map_err(|mut e| {
                e.emit();
                ()
            })
            .expect("failed to parser module");

        module
    });

    "fn answer() -> u32 { 42 }".parse().unwrap()
}
