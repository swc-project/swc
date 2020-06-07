use crate::pass::Pass;
use swc_common::{pass::CompilerPass, Fold};
use swc_ecma_ast::Ident;

mod merge;
mod rename;

pub fn minifier() -> impl CompilerPass + Pass + 'static {
    Minifier {
        scope: Default::default(),
    }
}

#[derive(Debug)]
struct Minifier<'a> {
    scope: Scope<'a>,
}

noop_fold_type!(Minifier<'_>);

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
}
