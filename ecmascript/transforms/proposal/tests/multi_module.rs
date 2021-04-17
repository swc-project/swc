#![cfg(feature = "multi-module")]

use std::path::PathBuf;

use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::Ident;
use swc_ecma_ast::*;
use swc_ecma_loader::Loader;
use swc_ecma_loader::Resolver;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_proposal::decorators::decorator_with_deps;
use swc_ecma_transforms_proposal::deps::module_analyzer;
use swc_ecma_transforms_proposal::deps::DepAnalyzer;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_transforms_testing::test_transform;
use swc_ecma_utils::ident::IdentLike;

/// Simple dependency analyzer which always resolve using `R` and load using
/// `L`.
#[derive(Debug, Clone)]
struct SimpleDepAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    loader: L,
    resolver: R,
}

impl<L, R> DepAnalyzer for SimpleDepAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    fn design_type_of(
        &self,
        base: &FileName,
        dep_src: &JsWord,
        imported: Ident,
    ) -> Result<Box<Expr>, Diagnostic> {
        let file = self.resolver.resolve(base, dep_src)?;
        let module = self.loader.load(&file)?;

        let analayzed = module_analyzer::analyze(&module);

        Ok(analayzed
            .metadata_types
            .get(&imported.to_id())
            .cloned()
            .unwrap_or_else(|| {
                Box::new(Expr::Ident(Ident::new(js_word!("Object"), imported.span)))
            }))
    }
}

#[testing::fixture("multi/**/input/index.ts")]
fn fixture(input: PathBuf) {
    let input_dir = input.parent().unwrap();
    let test_dir = input_dir.parent().unwrap();

    test_fixture(
        Syntax::Typescript(TsConfig {
            decorators: true,
            tsx: true,
            ..Default::default()
        }),
        &|_| {
            decorator_with_deps(
                decorators::Config {
                    legacy: true,
                    emit_metadata: true,
                },
                SimpleDepAnalyzer {},
            )
        },
        &input,
        &test_dir.join("output").join("output.js"),
    );
}
