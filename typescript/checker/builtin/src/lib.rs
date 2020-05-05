#![feature(box_syntax)]
#![feature(specialization)]

use fxhash::FxHashMap;
use once_cell::sync::Lazy;
use std::sync::{Arc, RwLock};
use swc_atoms::js_word;
use swc_common::{
    errors::{ColorConfig, Handler},
    fold::FoldWith,
    input::SourceFileInput,
    FileName, FilePathMapping, Fold, SourceMap, Span, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, Session, Syntax};
use swc_ts_builtin_macro::builtin;

builtin!();

impl Lib {
    fn body(self) -> &'static TsNamespaceDecl {
        static CACHE: Lazy<RwLock<FxHashMap<Lib, &'static TsNamespaceDecl>>> =
            Lazy::new(Default::default);

        {
            let read = CACHE.read().expect("no panic is expected");
            if let Some(v) = read.get(&self) {
                return v;
            }
        }

        let mut write = CACHE.write().expect("no panic is expect4ed");

        {
            if let Some(v) = write.get(&self) {
                return v;
            }
        }

        let v = Box::leak(box parse(self.content()));
        assert_eq!(write.insert(self, v), None);

        v
    }
}

/// Merge definitions
pub fn load(libs: &[Lib]) -> Vec<&'static TsNamespaceDecl> {
    libs.iter().map(|lib| lib.body()).collect()
}

fn parse(content: &str) -> TsNamespaceDecl {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    let fm = cm.new_source_file(FileName::Anon, content.to_string());

    let session = Session { handler: &handler };

    let mut parser = Parser::new(
        session,
        Syntax::Typescript(Default::default()),
        SourceFileInput::from(&*fm),
        None,
    );

    // We cannot use parse_module because of `eval`
    let script = parser
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
            body: script
                .body
                .fold_with(&mut DropSpan)
                .into_iter()
                .map(ModuleItem::Stmt)
                .collect(),
        }),
    }
}

#[derive(Clone, Copy)]
struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}
