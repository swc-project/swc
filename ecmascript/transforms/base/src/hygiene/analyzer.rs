use crate::scope::ScopeKind;
use std::{cell::RefCell, mem::take};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

#[derive(Debug, Default)]
pub struct Data {
    /// Top level scope uses [SyntaxContext::empty].
    pub scopes: AHashMap<SyntaxContext, ScopeData>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    pub kind: ScopeKind,

    pub decls: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,

    pub usages: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
}

pub struct CurScope<'a> {
    pub parent: Option<&'a CurScope<'a>>,
    pub scope_ctxt: SyntaxContext,
    pub data: ScopeData,
}

impl CurScope<'_> {
    fn add_decl(&self, id: Id) {
        {
            let mut b = self.data.decls.borrow_mut();
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        match self.parent {
            Some(v) => {
                v.add_decl(id);
            }
            None => {}
        }
    }

    fn add_usage(&self, id: Id) {
        {
            let mut b = self.data.usages.borrow_mut();
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        match self.parent {
            Some(v) => {
                v.add_usage(id);
            }
            None => {}
        }
    }
}

pub struct Analyzer<'a> {
    pub data: &'a mut Data,
    pub cur: CurScope<'a>,

    pub is_pat_decl: bool,
}

impl Analyzer<'_> {
    fn visit_with_scope<F>(&mut self, scope_ctxt: SyntaxContext, kind: ScopeKind, op: F)
    where
        F: for<'aa> FnOnce(&mut Analyzer<'aa>),
    {
        let mut child = Analyzer {
            data: self.data,
            cur: CurScope {
                parent: Some(&self.cur),
                scope_ctxt,
                data: ScopeData {
                    kind,
                    ..Default::default()
                },
            },
            is_pat_decl: self.is_pat_decl,
        };

        op(&mut child);

        let v = take(&mut child.cur.data);

        *self.data.scopes.entry(scope_ctxt).or_default() = v;
    }
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Fn, |v| f.visit_children_with(v))
    }

    fn visit_block_stmt(&mut self, f: &BlockStmt, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Block, |v| f.visit_children_with(v))
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.cur.add_usage(i.to_id());
            }
            _ => {}
        }
    }

    fn visit_function(&mut self, f: &Function, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Fn, |v| f.visit_children_with(v))
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.obj.visit_with(e, self);
        }
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                if self.is_pat_decl {
                    self.cur.add_decl(i.id.to_id());
                } else {
                    self.cur.add_usage(i.id.to_id());
                }
            }
            _ => {}
        }
    }
}
