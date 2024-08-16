use std::cell::RefCell;

use fxhash::{AHashMap, AHashSet};
use swc_atoms::JsWord;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

#[derive(Default)]
pub(super) struct All {
    pub scopes: AHashMap<SyntaxContext, VarHygieneData>,
}

pub(super) fn analyze<N>(node: &N) -> All
where
    N: for<'aa> VisitWith<VarAnalyzer<'aa>>,
{
    let mut data = All::default();
    let mut v = VarAnalyzer {
        all: &mut data,
        cur: Default::default(),
    };
    node.visit_with(&mut v);

    data
}

#[derive(Debug, Default)]
pub(super) struct VarHygieneData {
    pub decls: AHashMap<JsWord, AHashSet<SyntaxContext>>,
}

#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,

    data: RefCell<VarHygieneData>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            data: Default::default(),
        }
    }

    /// Add usage or declaration of a variable
    fn add(&mut self, i: &Ident) {
        let mut cur = Some(&*self);

        while let Some(scope) = cur {
            let mut w = scope.data.borrow_mut();
            w.decls.entry(i.sym.clone()).or_default().insert(i.ctxt);

            cur = scope.parent;
        }
    }
}

pub struct VarAnalyzer<'a> {
    all: &'a mut All,
    cur: Scope<'a>,
}

macro_rules! scoped {
    ($v:expr, $n:expr) => {
        let data = {
            let child = Scope::new(Some(&$v.cur));
            let mut v = VarAnalyzer {
                all: &mut $v.all,
                cur: child,
            };

            $n.visit_children_with(&mut v);

            v.cur.data.into_inner()
        };

        let old = $v.all.scopes.insert($n.ctxt, data);
        debug_assert!(old.is_none(), "{:?}", $n.ctxt);
    };
}

impl Visit for VarAnalyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        scoped!(self, n);
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        scoped!(self, n);
    }

    fn visit_function(&mut self, n: &Function) {
        scoped!(self, n);
    }

    fn visit_ident(&mut self, i: &Ident) {
        trace!("hygiene/vars: Found {}", i);

        self.cur.add(i);
    }
}
