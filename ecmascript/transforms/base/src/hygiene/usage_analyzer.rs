use super::ops::Operations;
use crate::scope::ScopeKind;
use std::{cell::RefCell, mem::take};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, ModuleItemLike, StmtLike};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

#[derive(Debug, Default)]

pub(super) struct Data {
    /// Top level scope uses [SyntaxContext::empty].
    pub scopes: AHashMap<SyntaxContext, ScopeData>,
    pub ops: RefCell<Operations>,
}

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    pub kind: ScopeKind,

    pub decls: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,

    /// Usages in current scope.
    pub direct_usages: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
    pub usages: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
}

pub(super) struct CurScope<'a> {
    pub parent: Option<&'a CurScope<'a>>,
    pub scope_ctxt: SyntaxContext,
    pub data: ScopeData,
}

impl CurScope<'_> {
    fn add_decl(&self, id: Id) {
        {
            let mut b = self.data.decls.borrow_mut();
            let ctxts_of_decls = b.entry(id.0.clone()).or_default();
            if !ctxts_of_decls.contains(&id.1) {
                ctxts_of_decls.push(id.1);
            }
        }

        if let ScopeKind::Fn = self.data.kind {
            return;
        }

        // TODO: Consider `var` / `let` / `const`.
        match self.parent {
            Some(v) => {
                v.add_decl(id);
            }
            None => {}
        }
    }

    fn add_usage(&self, id: Id) {
        self.add_usage_inner(id, true);
    }

    fn add_usage_inner(&self, id: Id, direct: bool) {
        if direct {
            let mut b = self.data.direct_usages.borrow_mut();
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        {
            let mut b = self.data.usages.borrow_mut();
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        match self.parent {
            Some(v) => {
                v.add_usage_inner(id, false);
            }
            None => {}
        }
    }
}

pub(super) struct UsageAnalyzer<'a> {
    pub data: &'a mut Data,
    pub cur: CurScope<'a>,

    pub is_pat_decl: bool,
}

impl UsageAnalyzer<'_> {
    fn new_symbol(&mut self, orig: Id) -> JsWord {
        let mut i = 0;
        loop {
            i += 1;
            let word: JsWord = format!("{}{}", orig.0, i).into();

            if self.data.ops.get_mut().is_used_as_rename_target(&word) {
                continue;
            }

            // TODO: Check for the current scope if the symbol is already used.
            break word;
        }
    }

    fn visit_with_scope<F>(&mut self, scope_ctxt: SyntaxContext, kind: ScopeKind, op: F)
    where
        F: for<'aa> FnOnce(&mut UsageAnalyzer<'aa>),
    {
        let mut child = UsageAnalyzer {
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

    fn visit_stmt_likes<N>(&mut self, stmts: &[N])
    where
        N: StmtLike + ModuleItemLike + for<'aa> VisitWith<UsageAnalyzer<'aa>>,
    {
        {
            // Hoist decls.
        }

        for stmt in stmts {
            stmt.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn add_decl(&mut self, id: Id) {
        let need_rename = {
            let mut b = self.cur.data.decls.borrow_mut();
            let ctxts_of_decls = b.entry(id.0.clone()).or_default();
            ctxts_of_decls.contains(&id.1)
        };

        if need_rename {
            let to = self.new_symbol(id.clone());
            self.data.ops.get_mut().rename(id, to)
        } else {
            self.cur.add_decl(id)
        }
    }

    fn add_usage(&self, id: Id) {
        self.cur.add_usage(id);
    }
}

impl Visit for UsageAnalyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Fn, |v| {
            f.params.visit_with(f, v);

            match &f.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    // Bypass
                    body.visit_children_with(v);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(f, v);
                }
            }
        })
    }

    fn visit_block_stmt(&mut self, f: &BlockStmt, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Block, |v| f.visit_children_with(v))
    }

    fn visit_catch_clause(&mut self, c: &CatchClause, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        c.param.visit_with(c, self);

        self.is_pat_decl = false;
        c.body.visit_with(c, self);

        self.is_pat_decl = old;
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.add_usage(i.to_id());
            }
            _ => {}
        }
    }

    fn visit_fn_decl(&mut self, f: &FnDecl, _: &dyn Node) {
        f.function.decorators.visit_with(f, self);

        self.add_decl(f.ident.to_id());

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            f.function.params.visit_with(f, v);

            match f.function.body.as_ref() {
                Some(body) => {
                    body.visit_children_with(v);
                }
                None => {}
            }
        })
    }

    fn visit_fn_expr(&mut self, f: &FnExpr, _: &dyn Node) {
        f.function.decorators.visit_with(f, self);

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            f.function.params.visit_with(f, v);

            if let Some(i) = &f.ident {
                v.add_decl(i.to_id());
            }

            match f.function.body.as_ref() {
                Some(body) => {
                    body.visit_children_with(v);
                }
                None => {}
            }
        })
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.obj.visit_with(e, self);
        }
    }

    fn visit_module(&mut self, m: &Module, _: &dyn Node) {
        self.visit_with_scope(m.span.ctxt, ScopeKind::Fn, |v| m.visit_children_with(v))
    }

    fn visit_module_items(&mut self, stmts: &[ModuleItem], _: &dyn Node) {
        self.visit_stmt_likes(stmts);
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                if self.is_pat_decl {
                    self.add_decl(i.id.to_id());
                } else {
                    self.add_usage(i.id.to_id());
                }
            }
            _ => {}
        }
    }

    fn visit_script(&mut self, s: &Script, _: &dyn Node) {
        self.visit_with_scope(s.span.ctxt, ScopeKind::Fn, |v| s.visit_children_with(v))
    }

    fn visit_stmts(&mut self, stmts: &[Stmt], _: &dyn Node) {
        self.visit_stmt_likes(stmts);
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(v, self);

        self.is_pat_decl = false;
        v.init.visit_with(v, self);

        self.is_pat_decl = old;
    }
}
