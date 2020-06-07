use crate::pass::Pass;
use fxhash::FxHashMap;
use smallvec::alloc::borrow::Cow;
use swc_atoms::JsWord;
use swc_common::{pass::CompilerPass, Fold, FoldWith, Mark};
use swc_ecma_ast::{Function, Ident};
use swc_ecma_utils::Id;

mod merge;
mod rename;

pub fn minifier(global_mark: Mark) -> impl CompilerPass + Pass + 'static {
    Minifier {
        global_mark,
        scope: Scope {
            parent: None,
            ..Default::default()
        },
    }
}

#[derive(Debug)]
struct Minifier<'a> {
    /// Identifiers marked with the marker are preserved.
    global_mark: Mark,
    scope: Scope<'a>,
}

noop_fold_type!(Minifier<'_>);

impl CompilerPass for Minifier<'_> {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("minifier")
    }
}

impl Minifier<'_> {
    fn fold_with_child<T>(&mut self, node: T) -> T
    where
        T: for<'any> FoldWith<Minifier<'any>>,
    {
        let mut child = Minifier {
            global_mark: self.global_mark,
            scope: Scope {
                parent: Some(&self.scope),
                ..Default::default()
            },
        };
        node.fold_children(&mut child)
    }
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    renamed: FxHashMap<Id, JsWord>,
}

impl Fold<Function> for Minifier<'_> {
    fn fold(&mut self, f: Function) -> Function {
        self.fold_with_child(f)
    }
}
