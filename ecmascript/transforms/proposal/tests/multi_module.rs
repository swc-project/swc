#![cfg(feature = "multi-module")]

use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::Ident;
use swc_ecma_ast::*;
use swc_ecma_loader::Loader;
use swc_ecma_loader::Resolver;
use swc_ecma_transforms_proposal::deps::module_analyzer;
use swc_ecma_transforms_proposal::deps::DepAnalyzer;
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
