use super::{ops::Operations, LOG};
use crate::scope::ScopeKind;
use std::{cell::RefCell, mem::take};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtOrModuleItem};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};
use tracing::{debug, span, trace, Level};

#[derive(Debug, Default)]

pub(super) struct Data {
    /// Top level scope uses [SyntaxContext::empty].
    pub scopes: AHashMap<SyntaxContext, ScopeData>,
    pub ops: RefCell<Operations>,
}

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    pub kind: ScopeKind,

    pub direct_decls: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
    pub decls: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,

    /// Usages in current scope.
    pub direct_usages: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
    pub usages: RefCell<AHashMap<JsWord, Vec<SyntaxContext>>>,
}

pub(super) struct CurScope<'a> {
    pub parent: Option<&'a CurScope<'a>>,
    pub data: ScopeData,
}

impl CurScope<'_> {
    fn contains_decl_with_symbol(&self, sym: &JsWord) -> bool {
        if let Some(ctxts) = self.data.decls.borrow().get(&sym) {
            if !ctxts.is_empty() {
                return true;
            }
        }
        match self.parent {
            Some(s) => s.contains_decl_with_symbol(sym),
            None => false,
        }
    }

    fn remove_usage(&self, id: &Id) {
        {
            let mut b = self.data.usages.borrow_mut();
            let ctxts_of_decls = b.get_mut(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                if let Some(pos) = ctxts_of_decls.iter().position(|&ctxt| ctxt == id.1) {
                    ctxts_of_decls.remove(pos);
                }
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        match self.parent {
            Some(v) => {
                v.remove_usage(id);
            }
            None => {}
        }
    }
    fn remove_decl(&self, id: &Id) {
        {
            let mut b = self.data.decls.borrow_mut();
            let ctxts_of_decls = b.get_mut(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                if let Some(pos) = ctxts_of_decls.iter().position(|&ctxt| ctxt == id.1) {
                    ctxts_of_decls.remove(pos);
                }
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        match self.parent {
            Some(v) => {
                v.remove_decl(id);
            }
            None => {}
        }
    }

    /// Called when we are exiting a scope.
    fn remove_decls_from_map(&self, map: &AHashMap<JsWord, Vec<SyntaxContext>>) {
        for (sym, dropped_ctxts) in map {
            let mut b = self.data.decls.borrow_mut();
            let ctxts_of_decls = b.get_mut(&sym);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                ctxts_of_decls.retain(|&ctxt| !dropped_ctxts.contains(&ctxt));
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        match self.parent {
            Some(v) => {
                v.remove_decls_from_map(map);
            }
            None => {}
        }
    }

    fn add_decl(&self, id: Id) {
        self.add_decl_inner(id, true)
    }

    fn add_decl_inner(&self, id: Id, direct: bool) {
        if direct {
            let mut b = self.data.direct_decls.borrow_mut();
            let ctxts_of_decls = b.entry(id.0.clone()).or_default();
            if !ctxts_of_decls.contains(&id.1) {
                ctxts_of_decls.push(id.1);
            }
        }

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
                v.add_decl_inner(id, false);
            }
            None => {}
        }
    }

    /// Given usage (`sym`), will it be resolved as `ctxt` if we don't rename
    /// it?
    fn conflict(&self, sym: &JsWord, ctxt: SyntaxContext) -> Vec<SyntaxContext> {
        let mut conflicts = match self.parent {
            Some(s) => s.conflict(sym, ctxt),
            None => vec![],
        };

        if let Some(ctxts) = self.data.decls.borrow().get(sym) {
            if ctxts.len() > 1 {
                return conflicts;
            }
            conflicts.extend(ctxts.iter().copied().filter(|&cx| cx != ctxt));
        }

        conflicts
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
    fn get_renamed_id(&self, id: Id) -> Id {
        let sym = self.data.ops.borrow().get_renamed(&id);

        match sym {
            Some(sym) => (sym, SyntaxContext::empty()),
            None => id,
        }
    }

    fn rename(&mut self, id: Id) {
        if LOG {
            trace!("Renaming `{}{:?}`", id.0, id.1)
        }
        let to = self.new_symbol(id.clone());
        self.cur.remove_decl(&id);
        self.cur.remove_usage(&id);
        self.data.ops.get_mut().rename(id, to);
    }

    fn new_symbol(&mut self, orig: Id) -> JsWord {
        let mut i = 0;
        loop {
            i += 1;
            let word: JsWord = format!("{}{}", orig.0, i).into();

            if self.data.ops.get_mut().is_used_as_rename_target(&word) {
                continue;
            }

            if self.cur.contains_decl_with_symbol(&word) {
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
        let _tracing = if LOG {
            let ctxt_str = format!("{:?}", scope_ctxt);
            let kind_str = format!("{:?}", kind);
            //
            Some(span!(Level::ERROR, "Scope", ctxt = &*ctxt_str, kind = &*kind_str).entered())
        } else {
            None
        };

        let mut child = UsageAnalyzer {
            data: self.data,
            cur: CurScope {
                parent: Some(&self.cur),
                data: ScopeData {
                    kind,
                    ..Default::default()
                },
            },
            is_pat_decl: self.is_pat_decl,
        };

        op(&mut child);

        let v = take(&mut child.cur.data);

        {
            let decls_in_scope = take(&mut *v.direct_decls.borrow_mut());

            self.cur.remove_decls_from_map(&decls_in_scope);
        }

        *self.data.scopes.entry(scope_ctxt).or_default() = v;
    }

    fn visit_stmt_likes<N>(&mut self, stmts: &[N])
    where
        N: StmtOrModuleItem
            + for<'aa> VisitWith<UsageAnalyzer<'aa>>
            + for<'aa, 'bb> VisitWith<Hoister<'aa, 'bb>>,
    {
        {
            // Hoist decls.

            let mut v = Hoister {
                inner: self,
                in_block_stmt: false,
                var_decl_kind: None,
                is_pat_decl: false,
            };

            for stmt in stmts {
                stmt.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
            }
        }

        for stmt in stmts {
            stmt.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn add_decl(&mut self, id: Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        if LOG {
            trace!("Decl: `{}{:?}`", id.0, id.1);
        }

        let id = self.get_renamed_id(id);

        let need_rename = {
            let b = self.cur.data.decls.borrow();
            let ctxts_of_decls = b.get(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                let cur_scope_conflict = if ctxts_of_decls.contains(&id.1) {
                    ctxts_of_decls.len() > 1
                } else {
                    ctxts_of_decls.len() > 0
                };

                if cur_scope_conflict {
                    if LOG {
                        debug!("Renaming: Decl-decl conflict (same scope)");
                    }
                }

                cur_scope_conflict
            } else {
                // Fresh decl
                false
            }
        };

        if need_rename {
            self.rename(id)
        } else {
            self.cur.add_decl(id)
        }
    }

    fn add_usage(&mut self, id: Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        if LOG {
            trace!("Usage: `{}{:?}`", id.0, id.1);
        }

        let id = self.get_renamed_id(id);

        // We rename decl instead of usage.
        let conflicts = self.cur.conflict(&id.0, id.1);

        for ctxt in conflicts {
            if LOG {
                debug!("Renaming decl: Usage-decl conflict (ctxt={:?})", ctxt);
            }
            self.rename((id.0.clone(), ctxt));
        }

        self.cur.add_usage(id);
    }
}

impl Visit for UsageAnalyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Fn, |v| {
            let old = v.is_pat_decl;
            v.is_pat_decl = true;
            f.params.visit_with(f, v);
            v.is_pat_decl = old;

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

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp, _: &dyn Node) {
        node.visit_children_with(self);

        {
            if self.is_pat_decl {
                self.add_decl(node.key.to_id());
            } else {
                self.add_usage(node.key.to_id());
            }
        }
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

    fn visit_class_decl(&mut self, c: &ClassDecl, _: &dyn Node) {
        self.add_decl(c.ident.to_id());
        c.visit_children_with(self);
    }

    fn visit_class_expr(&mut self, c: &ClassExpr, _: &dyn Node) {
        self.visit_with_scope(c.class.span.ctxt, ScopeKind::Fn, |v| {
            if let Some(i) = &c.ident {
                v.add_decl(i.to_id());
            }

            c.visit_children_with(v);
        })
    }

    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _: &dyn Node) {
        self.add_usage(n.exported.to_id());
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.add_usage(n.orig.to_id());
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
            v.is_pat_decl = true;
            f.function.params.visit_with(f, v);

            v.is_pat_decl = false;
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
            v.is_pat_decl = true;
            f.function.params.visit_with(f, v);

            if let Some(i) = &f.ident {
                v.add_decl(i.to_id());
            }

            v.is_pat_decl = false;
            match f.function.body.as_ref() {
                Some(body) => {
                    body.visit_children_with(v);
                }
                None => {}
            }
        })
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier, _: &dyn Node) {
        self.add_decl(s.local.to_id());
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier, _: &dyn Node) {
        self.add_decl(s.local.to_id());
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier, _: &dyn Node) {
        self.add_decl(s.local.to_id());
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.obj.visit_with(e, self);
        }
    }

    fn visit_method_prop(&mut self, f: &MethodProp, _: &dyn Node) {
        f.key.visit_with(f, self);

        f.function.decorators.visit_with(f, self);

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            f.function.params.visit_with(f, v);

            v.is_pat_decl = false;
            match f.function.body.as_ref() {
                Some(body) => {
                    body.visit_children_with(v);
                }
                None => {}
            }
        })
    }

    fn visit_module(&mut self, m: &Module, _: &dyn Node) {
        self.visit_with_scope(m.span.ctxt, ScopeKind::Fn, |v| m.visit_children_with(v))
    }

    fn visit_module_items(&mut self, stmts: &[ModuleItem], _: &dyn Node) {
        self.visit_stmt_likes(stmts);
    }

    fn visit_param(&mut self, p: &Param, _: &dyn Node) {
        p.decorators.visit_with(p, self);

        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        p.pat.visit_with(p, self);
        self.is_pat_decl = old;
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

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                self.add_usage(i.to_id());
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

struct Hoister<'a, 'b> {
    inner: &'a mut UsageAnalyzer<'b>,

    in_block_stmt: bool,

    var_decl_kind: Option<VarDeclKind>,
    is_pat_decl: bool,
}

/// We don't recurse into [ArrowExpr] or [Function] because declarations in it
/// are not visible to current scope.
impl Visit for Hoister<'_, '_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp, _: &dyn Node) {
        node.visit_children_with(self);

        {
            if !self.is_pat_decl {
                return;
            }
            if self.in_block_stmt {
                //
                if let Some(VarDeclKind::Const | VarDeclKind::Let) = self.var_decl_kind {
                    return;
                }
            } else {
            }

            self.inner.add_decl(node.key.to_id());
        }
    }

    fn visit_block_stmt(&mut self, b: &BlockStmt, _: &dyn Node) {
        let old = self.in_block_stmt;
        self.in_block_stmt = true;
        b.visit_children_with(self);
        self.in_block_stmt = old;
    }

    fn visit_block_stmt_or_expr(&mut self, _: &BlockStmtOrExpr, _: &dyn Node) {}

    fn visit_class_decl(&mut self, c: &ClassDecl, _: &dyn Node) {
        c.visit_children_with(self);

        if self.in_block_stmt {
            return;
        }

        self.inner.add_decl(c.ident.to_id());
    }

    fn visit_constructor(&mut self, c: &Constructor, _: &dyn Node) {
        c.params.visit_with(c, self);
    }

    fn visit_fn_decl(&mut self, f: &FnDecl, _: &dyn Node) {
        if LOG {
            trace!("hoister: Fn decl: `{}`", f.ident);
        }

        self.inner.add_decl(f.ident.to_id());
    }

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}

    fn visit_param(&mut self, _: &Param, _: &dyn Node) {}

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                if !self.is_pat_decl {
                    return;
                }
                if self.in_block_stmt {
                    //
                    if let Some(VarDeclKind::Const | VarDeclKind::Let) = self.var_decl_kind {
                        return;
                    }
                } else {
                }

                self.inner.add_decl(i.id.to_id());
            }
            _ => {}
        }
    }

    fn visit_var_decl(&mut self, v: &VarDecl, _: &dyn Node) {
        let old = self.var_decl_kind;

        self.var_decl_kind = Some(v.kind);
        v.decls.visit_with(v, self);

        self.var_decl_kind = old;
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
