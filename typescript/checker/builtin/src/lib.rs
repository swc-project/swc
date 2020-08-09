#![deny(unused)]

use fxhash::FxHashMap;
use once_cell::sync::Lazy;
use std::sync::{Arc, RwLock};
use swc_atoms::js_word;
use swc_common::{FileName, FilePathMapping, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_visit::{span_remover, FoldWith};
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

        let v = Box::leak(Box::new(parse(self.content())));
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

    let fm = cm.new_source_file(FileName::Anon, content.to_string());
    let lexer = Lexer::new(
        Syntax::Typescript(TsConfig {
            dts: true,
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    // We cannot use parse_module because of `eval`
    let script = parser.parse_script().expect("failed to parse module");

    TsNamespaceDecl {
        span: DUMMY_SP,
        declare: true,
        global: true,
        id: Ident::new(js_word!(""), DUMMY_SP),
        body: Box::new(TsNamespaceBody::TsModuleBlock(TsModuleBlock {
            span: DUMMY_SP,
            body: script
                .body
                .fold_with(&mut span_remover())
                .into_iter()
                .map(ModuleItem::Stmt)
                .collect(),
        })),
    }
}
