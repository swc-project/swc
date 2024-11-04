use rustc_hash::FxHashSet;
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::option::MangleOptions;

/// Returns `(preserved, unresolved)`
pub(crate) fn idents_to_preserve<N>(options: &MangleOptions, marks: Marks, n: &N) -> FxHashSet<Id>
where
    N: for<'a> VisitWith<Preserver<'a>>,
{
    let mut v = Preserver {
        options,
        preserved: Default::default(),
        should_preserve: false,
        in_top_level: false,
    };
    n.visit_with(&mut v);

    let top_level_mark = marks.top_level_ctxt.outer();

    // Force rename synthesized names
    // See https://github.com/swc-project/swc/issues/9468
    v.preserved.retain(|id| {
        options.reserved.contains(&id.0) || id.1.outer().is_descendant_of(top_level_mark)
    });

    v.preserved
}
pub(crate) struct Preserver<'a> {
    options: &'a MangleOptions,

    preserved: FxHashSet<Id>,

    should_preserve: bool,
    in_top_level: bool,
}

impl Preserver<'_> {
    fn is_reserved(&self, ident: &Ident) -> bool {
        self.options.reserved.contains(&ident.sym)
    }
}

impl Visit for Preserver<'_> {
    noop_visit_type!();

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        let old_top_level = self.in_top_level;
        for n in n.stmts.iter() {
            self.in_top_level = false;
            n.visit_with(self);
        }
        self.in_top_level = old_top_level;
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        let old = self.should_preserve;

        if self.options.ie8 && !self.options.top_level.unwrap_or_default() {
            self.should_preserve = true;
            n.param.visit_with(self);
        }

        self.should_preserve = old;
        n.body.visit_with(self);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        n.visit_children_with(self);

        if (self.in_top_level && !self.options.top_level.unwrap_or_default())
            || self.options.keep_class_names
            || self.is_reserved(&n.ident)
        {
            self.preserved.insert(n.ident.to_id());
        }
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if self.options.keep_class_names {
            if let Some(i) = &n.ident {
                self.preserved.insert(i.to_id());
            }
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        n.visit_children_with(self);

        match &n.decl {
            Decl::Class(c) => {
                self.preserved.insert(c.ident.to_id());
            }
            Decl::Fn(f) => {
                self.preserved.insert(f.ident.to_id());
            }
            Decl::Var(v) => {
                let ids: Vec<Id> = find_pat_ids(&v.decls);
                self.preserved.extend(ids);
            }
            _ => {}
        }
    }

    fn visit_expr(&mut self, n: &Expr) {
        n.visit_children_with(self);

        if let Expr::Ident(i) = n {
            if self.should_preserve || self.is_reserved(i) {
                self.preserved.insert(i.to_id());
            }
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        n.visit_children_with(self);

        if (self.in_top_level && !self.options.top_level.unwrap_or_default())
            || self.is_reserved(&n.ident)
            || self.options.keep_fn_names
        {
            self.preserved.insert(n.ident.to_id());
        }
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        n.visit_children_with(self);

        if self.options.keep_fn_names {
            if let Some(i) = &n.ident {
                self.preserved.insert(i.to_id());
            }
        }
    }

    fn visit_ident(&mut self, _: &Ident) {}

    fn visit_module_items(&mut self, n: &[ModuleItem]) {
        for n in n {
            self.in_top_level = true;
            n.visit_with(self);
        }
    }

    fn visit_pat(&mut self, n: &Pat) {
        n.visit_children_with(self);

        if let Pat::Ident(i) = n {
            if self.should_preserve || self.is_reserved(&i.id) {
                self.preserved.insert(i.to_id());
            }
        }
    }

    fn visit_script(&mut self, n: &Script) {
        for n in n.body.iter() {
            self.in_top_level = true;
            n.visit_with(self);
        }
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        n.visit_children_with(self);

        if self.in_top_level && !self.options.top_level.unwrap_or_default() {
            let old = self.should_preserve;
            self.should_preserve = true;
            n.name.visit_with(self);
            self.should_preserve = old;
            return;
        }

        if self.options.keep_fn_names {
            match n.init.as_deref() {
                Some(Expr::Fn(..)) | Some(Expr::Arrow(..)) => {
                    let old = self.should_preserve;
                    self.should_preserve = true;
                    n.name.visit_with(self);
                    self.should_preserve = old;
                }
                _ => {}
            }
        }
    }
}
