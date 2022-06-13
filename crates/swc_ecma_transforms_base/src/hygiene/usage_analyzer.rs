use std::{cell::RefCell, mem::take};

use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::StmtOrModuleItem;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use tracing::{debug, span, trace, Level};

use super::{ops::Operations, LOG};
use crate::scope::ScopeKind;

#[derive(Debug, Default)]

pub(super) struct Data {
    /// Top level scope uses [SyntaxContext::empty].
    pub scopes: AHashMap<SyntaxContext, ScopeData>,
    pub ops: RefCell<Operations>,
    idx_cache: AHashMap<JsWord, usize>,
}

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    pub kind: ScopeKind,

    pub direct_decls: AHashMap<JsWord, Vec<SyntaxContext>>,
    pub decls: AHashMap<JsWord, Vec<(u16, SyntaxContext)>>,

    /// Usages in current scope.
    pub direct_usages: AHashMap<JsWord, Vec<SyntaxContext>>,
    pub usages: AHashMap<JsWord, Vec<SyntaxContext>>,
}

pub(super) struct CurScope<'a> {
    pub parent: Option<&'a CurScope<'a>>,
    pub data: RefCell<ScopeData>,
    pub depth: u16,
}

impl CurScope<'_> {
    fn contains_decl_with_symbol(&self, sym: &JsWord) -> bool {
        if let Some(ctxts) = self.data.borrow().decls.get(sym) {
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
            let mut b = &mut self.data.borrow_mut().usages;
            let ctxts_of_decls = b.get_mut(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                if let Some(pos) = ctxts_of_decls.iter().position(|&ctxt| ctxt == id.1) {
                    ctxts_of_decls.remove(pos);
                }
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        if let Some(v) = self.parent {
            v.remove_usage(id);
        }
    }

    fn remove_decl(&self, id: &Id) {
        {
            let mut b = &mut self.data.borrow_mut().decls;
            let ctxts_of_decls = b.get_mut(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                if let Some(pos) = ctxts_of_decls.iter().position(|&(_, ctxt)| ctxt == id.1) {
                    ctxts_of_decls.remove(pos);
                }
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        if let Some(v) = self.parent {
            v.remove_decl(id);
        }
    }

    /// Called when we are exiting a scope.
    fn remove_decls_from_map(&self, map: &AHashMap<JsWord, Vec<SyntaxContext>>) {
        for (sym, dropped_ctxts) in map {
            let mut b = &mut self.data.borrow_mut().decls;
            let ctxts_of_decls = b.get_mut(sym);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                ctxts_of_decls.retain(|&(_, ctxt)| !dropped_ctxts.contains(&ctxt));
            }
        }

        // TODO: Consider `var` / `let` / `const`.
        if let Some(v) = self.parent {
            v.remove_decls_from_map(map);
        }
    }

    fn add_decl(&self, id: Id) {
        self.add_decl_inner(id, true)
    }

    fn add_decl_inner(&self, id: Id, direct: bool) {
        if direct {
            let mut b = &mut self.data.borrow_mut().direct_decls;
            let ctxts_of_decls = b.entry(id.0.clone()).or_default();
            if !ctxts_of_decls.contains(&id.1) {
                ctxts_of_decls.push(id.1);
            }
        }

        {
            let mut b = &mut self.data.borrow_mut().decls;
            let ctxts_of_decls = b.entry(id.0.clone()).or_default();
            if !ctxts_of_decls.iter().any(|(_, ctxt)| ctxt == &id.1) {
                ctxts_of_decls.push((self.depth, id.1));
            }
        }

        if let ScopeKind::Fn = self.data.borrow().kind {
            return;
        }

        // TODO: Consider `var` / `let` / `const`.
        if let Some(v) = self.parent {
            v.add_decl_inner(id, false);
        }
    }

    /// Given usage (`sym`), will it be resolved as `ctxt` if we don't rename
    /// it?
    fn conflict(&self, sym: &JsWord, ctxt: SyntaxContext) -> Vec<(u16, SyntaxContext)> {
        let mut conflicts = match self.parent {
            Some(s) => s.conflict(sym, ctxt),
            None => vec![],
        };

        if let Some(ctxts) = self.data.borrow().decls.get(sym) {
            if ctxts.len() > 1 {
                return conflicts;
            }
            conflicts.extend(ctxts.iter().copied().filter(|(_, cx)| cx != &ctxt));
        }

        conflicts
    }

    fn scope_depth(&self, id: &Id) -> u16 {
        if let Some(ctxts) = self.data.borrow().decls.get(&id.0) {
            for (scope_depth, ctxt) in ctxts.iter() {
                if ctxt == &id.1 {
                    return *scope_depth;
                }
            }
        }

        match self.parent {
            Some(parent) => parent.scope_depth(id),
            None => 0,
        }
    }

    fn add_usage(&self, id: Id) {
        self.add_usage_inner(id, true);
    }

    fn add_usage_inner(&self, id: Id, direct: bool) {
        if direct {
            let mut b = &mut self.data.borrow_mut().direct_usages;
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        {
            let mut b = &mut self.data.borrow_mut().usages;
            let v = b.entry(id.0.clone()).or_default();
            if !v.contains(&id.1) {
                v.push(id.1);
            }
        }

        if let Some(v) = self.parent {
            v.add_usage_inner(id, false);
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
        let i = self.data.idx_cache.entry(orig.0.clone()).or_default();
        loop {
            *i += 1;
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
                data: RefCell::new(ScopeData {
                    kind,
                    ..Default::default()
                }),
                depth: self.cur.depth + 1,
            },
            is_pat_decl: self.is_pat_decl,
        };

        op(&mut child);

        let v = take(&mut child.cur.data);

        {
            let decls_in_scope = take(&mut v.borrow_mut().direct_decls);

            self.cur.remove_decls_from_map(&decls_in_scope);
        }

        *self.data.scopes.entry(scope_ctxt).or_default() = v.into_inner();
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
                stmt.visit_with(&mut v);
            }
        }

        for stmt in stmts {
            stmt.visit_with(self);
        }
    }

    fn add_decl(&mut self, id: Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        if LOG {
            trace!("Decl: `{}{:?}`", id.0, id.1);
        }

        self.data.ops.borrow_mut().add_used(id.0.clone());

        let id = self.get_renamed_id(id);

        let need_rename = {
            let b = &self.cur.data.borrow().decls;
            let ctxts_of_decls = b.get(&id.0);

            if let Some(ctxts_of_decls) = ctxts_of_decls {
                let cur_scope_conflict = if ctxts_of_decls.iter().any(|(_, ctxt)| ctxt == &id.1) {
                    ctxts_of_decls.len() > 1
                } else {
                    !ctxts_of_decls.is_empty()
                };

                if cur_scope_conflict && LOG {
                    debug!("Renaming: Decl-decl conflict (same scope)");
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

        self.data.ops.borrow_mut().add_used(id.0.clone());

        let id = self.get_renamed_id(id);

        // We rename based on the scope depth of the identifier
        let conflicts = self.cur.conflict(&id.0, id.1);
        if !conflicts.is_empty() {
            let scope_depth = self.cur.scope_depth(&id);
            let mut top_match = (scope_depth, id.1);

            for (scope_depth, ctxt) in conflicts.iter() {
                if scope_depth < &top_match.0 {
                    top_match = (*scope_depth, *ctxt);
                }
            }

            let top_level_depth = 1; // 1 because script and module create a scope
            let renames = if top_match.0 == top_level_depth {
                let mut all_candidates = conflicts;
                all_candidates.push((scope_depth, id.1));
                all_candidates
                    .into_iter()
                    .filter(|(depth, _)| *depth > top_level_depth)
                    .collect()
            } else {
                conflicts
            };

            for (_, ctxt) in renames {
                if LOG {
                    debug!("Renaming decl: Usage-decl conflict (ctxt={:?})", ctxt);
                }

                self.rename((id.0.clone(), ctxt));
            }
        }

        self.cur.add_usage(id);
    }
}

impl Visit for UsageAnalyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Fn, |v| {
            let old = v.is_pat_decl;
            v.is_pat_decl = true;
            f.params.visit_with(v);
            v.is_pat_decl = false;

            match &f.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    // Bypass
                    body.visit_children_with(v);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(v);
                }
            }

            v.is_pat_decl = old;
        })
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.visit_children_with(self);

        if self.is_pat_decl {
            self.add_decl(node.key.to_id());
        } else {
            self.add_usage(node.key.to_id());
        }
    }

    fn visit_block_stmt(&mut self, f: &BlockStmt) {
        self.visit_with_scope(f.span.ctxt, ScopeKind::Block, |v| f.visit_children_with(v))
    }

    fn visit_catch_clause(&mut self, c: &CatchClause) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        c.param.visit_with(self);

        self.is_pat_decl = false;
        c.body.visit_with(self);

        self.is_pat_decl = old;
    }

    fn visit_class_decl(&mut self, c: &ClassDecl) {
        self.add_decl(c.ident.to_id());
        c.visit_children_with(self);
    }

    fn visit_class_expr(&mut self, c: &ClassExpr) {
        self.visit_with_scope(c.class.span.ctxt, ScopeKind::Fn, |v| {
            if let Some(i) = &c.ident {
                v.add_decl(i.to_id());
            }

            c.visit_children_with(v);
        })
    }

    fn visit_class_method(&mut self, m: &ClassMethod) {
        m.function.decorators.visit_with(self);

        self.visit_with_scope(m.function.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            m.function.params.visit_with(v);
            v.is_pat_decl = false;

            if let Some(body) = m.function.body.as_ref() {
                body.visit_children_with(v);
            }
        })
    }

    fn visit_constructor(&mut self, c: &Constructor) {
        self.visit_with_scope(c.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            c.params.visit_with(v);
            v.is_pat_decl = false;

            if let Some(body) = c.body.as_ref() {
                body.visit_children_with(v);
            }
        })
    }

    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier) {
        self.add_usage(n.exported.to_id());
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        if let ModuleExportName::Ident(orig) = &n.orig {
            self.add_usage(orig.to_id());
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add_usage(i.to_id());
        }
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        f.function.decorators.visit_with(self);

        self.add_decl(f.ident.to_id());

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            f.function.params.visit_with(v);
            v.is_pat_decl = false;

            if let Some(body) = f.function.body.as_ref() {
                body.visit_children_with(v);
            }
        })
    }

    fn visit_fn_expr(&mut self, f: &FnExpr) {
        f.function.decorators.visit_with(self);

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            f.function.params.visit_with(v);

            if let Some(i) = &f.ident {
                v.add_decl(i.to_id());
            }

            v.is_pat_decl = false;
            if let Some(body) = f.function.body.as_ref() {
                body.visit_children_with(v);
            }
        })
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier) {
        self.add_decl(s.local.to_id());
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier) {
        self.add_decl(s.local.to_id());
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier) {
        self.add_decl(s.local.to_id());
    }

    fn visit_method_prop(&mut self, f: &MethodProp) {
        f.key.visit_with(self);

        f.function.decorators.visit_with(self);

        self.visit_with_scope(f.function.span.ctxt, ScopeKind::Fn, |v| {
            v.is_pat_decl = true;
            f.function.params.visit_with(v);

            v.is_pat_decl = false;
            if let Some(body) = f.function.body.as_ref() {
                body.visit_children_with(v);
            }
        })
    }

    fn visit_module(&mut self, m: &Module) {
        self.visit_with_scope(m.span.ctxt, ScopeKind::Fn, |v| m.visit_children_with(v))
    }

    fn visit_module_items(&mut self, stmts: &[ModuleItem]) {
        self.visit_stmt_likes(stmts);
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.src.is_some() {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, p: &Param) {
        p.decorators.visit_with(self);

        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        p.pat.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(i) = p {
            if self.is_pat_decl {
                self.add_decl(i.id.to_id());
            } else {
                self.add_usage(i.id.to_id());
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add_usage(i.to_id());
        }
    }

    fn visit_script(&mut self, s: &Script) {
        self.visit_with_scope(s.span.ctxt, ScopeKind::Fn, |v| s.visit_children_with(v))
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        self.visit_stmt_likes(stmts);
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(self);

        self.is_pat_decl = false;
        v.init.visit_with(self);

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

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
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

    fn visit_block_stmt(&mut self, b: &BlockStmt) {
        let old = self.in_block_stmt;
        self.in_block_stmt = true;
        b.visit_children_with(self);
        self.in_block_stmt = old;
    }

    fn visit_block_stmt_or_expr(&mut self, _: &BlockStmtOrExpr) {}

    fn visit_class_decl(&mut self, c: &ClassDecl) {
        c.visit_children_with(self);

        if self.in_block_stmt {
            return;
        }

        self.inner.add_decl(c.ident.to_id());
    }

    fn visit_constructor(&mut self, c: &Constructor) {
        c.params.visit_with(self);
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        if LOG {
            trace!("hoister: Fn decl: `{}`", f.ident);
        }

        self.inner.add_decl(f.ident.to_id());
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_param(&mut self, _: &Param) {}

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(i) = p {
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
    }

    fn visit_var_decl(&mut self, v: &VarDecl) {
        let old = self.var_decl_kind;

        self.var_decl_kind = Some(v.kind);
        v.decls.visit_with(self);

        self.var_decl_kind = old;
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(self);

        self.is_pat_decl = false;
        v.init.visit_with(self);

        self.is_pat_decl = old;
    }
}
