use crate::reducer::ast_reducer;
use anyhow::{Context, Error};
use swc_common::{sync::Lrc, Mark, SourceFile, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_visit::VisitMutWith;
use swc_estree_ast::flavor::Flavor;
use swc_estree_compat::babelify::Babelify;
use swc_timer::timer;

pub mod reducer;

/// `n` is expected to be pure (`resolver` is not applied)
pub fn webpack_ast(
    cm: Lrc<SourceMap>,
    fm: Lrc<SourceFile>,
    mut n: Module,
) -> Result<String, Error> {
    let _timer = timer!("webpack_ast");
    let top_level_mark = Mark::fresh(Mark::root());

    Flavor::Acorn.with(|| {
        {
            let _timer = timer!("resolver");
            n.visit_mut_with(&mut resolver_with_mark(top_level_mark));
        }
        {
            n.visit_mut_with(&mut ast_reducer(top_level_mark));
        }

        let ctx = swc_estree_compat::babelify::Context {
            fm,
            cm: cm.clone(),
            comments: Default::default(),
        };

        let babel_ast = {
            let _timer = timer!("babelify");
            n.babelify(&ctx)
        };

        let _timer = timer!("acorn ast to json");
        serde_json::to_string(&babel_ast).context("failed to serialize babel ast")
    })
}
