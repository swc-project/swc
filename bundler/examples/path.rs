use anyhow::Error;
use fxhash::FxHashMap;
use swc_bundler::{BundleKind, Bundler, Load, Resolve};
use swc_common::{sync::Lrc, FileName, FilePathMapping, Globals, SourceMap};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};

fn main() {
    let globals = Globals::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    // This example does not use core modules.
    let external_modules = vec![];
    let bundler = Bundler::new(
        &globals,
        cm.clone(),
        PathLoader { cm: cm.clone() },
        PathResolver,
        external_modules,
    );
    let mut entries = FxHashMap::default();
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
}

struct PathLoader {
    cm: Lrc<SourceMap>,
}

impl Load for PathLoader {
    fn load(
        &self,
        file: &FileName,
    ) -> Result<(Lrc<swc_common::SourceFile>, swc_ecma_ast::Module), Error> {
        let file = match file {
            FileName::Real(v) => v,
            _ => unreachable!(),
        };

        let fm = self.cm.load_file(file)?;
        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                // assets/a.js uses this
                export_default_from: true,
                ..Default::default()
            }),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().expect("This should not happen");

        Ok((fm, module))
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
