use anyhow::Error;
use std::{collections::HashMap, io::stdout};
use swc_bundler::{BundleKind, Bundler, Config, Hook, Load, ModuleData, ModuleRecord, Resolve};
use swc_common::{sync::Lrc, FileName, FilePathMapping, Globals, SourceMap, Span};
use swc_ecma_ast::KeyValueProp;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};

fn main() {
    testing::init();

    let globals = Globals::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    // This example does not use core modules.
    let external_modules = vec![];
    let bundler = Bundler::new(
        &globals,
        cm.clone(),
        PathLoader { cm: cm.clone() },
        PathResolver,
        Config {
            require: true,
            external_modules,
            ..Default::default()
        },
        Box::new(Noop),
    );
    let mut entries = HashMap::default();
    entries.insert("main".to_string(), FileName::Real("assets/main.js".into()));

    let mut bundles = bundler.bundle(entries).expect("failed to bundle");
    assert_eq!(
        bundles.len(),
        1,
        "There's no conditional / dynamic imports and we provided only one entry"
    );
    let bundle = bundles.pop().unwrap();
    assert_eq!(
        bundle.kind,
        BundleKind::Named {
            name: "main".into()
        },
        "We provided it"
    );

    let wr = stdout();
    let mut emitter = Emitter {
        cfg: swc_ecma_codegen::Config { minify: false },
        cm: cm.clone(),
        comments: None,
        wr: Box::new(JsWriter::new(cm.clone(), "\n", wr.lock(), None)),
    };

    emitter.emit_module(&bundle.module).unwrap();
}

struct PathLoader {
    cm: Lrc<SourceMap>,
}

impl Load for PathLoader {
    fn load(&self, file: &FileName) -> Result<ModuleData, Error> {
        let file = match file {
            FileName::Real(v) => v,
            _ => unreachable!(),
        };

        let fm = self.cm.load_file(file)?;
        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().expect("This should not happen");

        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
}
struct PathResolver;

impl Resolve for PathResolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        assert!(
            module_specifier.starts_with("."),
            "We are not using node_modules within this example"
        );

        let base = match base {
            FileName::Real(v) => v,
            _ => unreachable!(),
        };

        Ok(FileName::Real(
            base.parent()
                .unwrap()
                .join(module_specifier)
                .with_extension("js"),
        ))
    }
}

struct Noop;

impl Hook for Noop {
    fn get_import_meta_props(&self, _: Span, _: &ModuleRecord) -> Result<Vec<KeyValueProp>, Error> {
        unimplemented!()
    }
}
