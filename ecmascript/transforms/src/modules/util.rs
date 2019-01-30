use crate::util::ExprFactory;
use ast::*;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{Fold, SyntaxContext, DUMMY_SP};

pub(super) trait ModuleSystem: Send + Sync + Clone {
    fn fold_module_item(&mut self, buf: &mut Vec<ModuleItem>, item: ModuleItem);
}

#[derive(Clone)]
pub(super) struct Folder<M: ModuleSystem> {
    visitor: M,
    scope: Scope,
}

#[derive(Clone, Default)]
pub(super) struct Scope {
    /// Map from source file to ident
    imports: FxHashMap<JsWord, (JsWord, SyntaxContext)>,
}

impl<M: ModuleSystem> Folder<M> {
    pub fn new(visitor: M) -> Self {
        Folder {
            visitor,
            scope: Default::default(),
        }
    }
}

impl<M: ModuleSystem> Fold<Vec<ModuleItem>> for Folder<M> {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut buf = Vec::with_capacity(items.len() + 1);

        // It's a module code.
        buf.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Lit(Lit::Str(
            quote_str!("use strict"),
        )))));

        for item in items {
            self.visitor.fold_module_item(&mut buf, item);
        }

        buf
    }
}

pub(super) fn make_require_call(src: Str) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("require").as_callee(),
        args: vec![Lit::Str(src).as_arg()],

        type_args: Default::default(),
    })
}
