use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Mark, Span, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::marks::Marks;

#[cfg(test)]
mod tests;

/// This pass analyzes the comment and convert it to a mark.
pub(crate) fn info_marker(
    comments: Option<&dyn Comments>,
    marks: Marks,
    unresolved_mark: Mark,
) -> impl '_ + VisitMut {
    InfoMarker {
        comments,
        marks,
        unresolved_mark,
        state: Default::default(),
    }
}

#[derive(Default)]
struct State {
    is_bundle: bool,
    is_in_export: bool,
}

struct InfoMarker<'a> {
    comments: Option<&'a dyn Comments>,
    marks: Marks,
    unresolved_mark: Mark,
    state: State,
}

impl InfoMarker<'_> {
    /// Check for `/** @const */`.
    pub(super) fn has_const_ann(&self, span: Span) -> bool {
        self.find_comment(span, |c| {
            if c.kind == CommentKind::Block {
                if !c.text.starts_with('*') {
                    return false;
                }
                let t = c.text[1..].trim();
                //
                if t.starts_with("@const") {
                    return true;
                }
            }

            false
        })
    }

    /// Check for `/*#__NOINLINE__*/`
    pub(super) fn has_noinline(&self, span: Span) -> bool {
        self.has_flag(span, "NOINLINE")
    }

    /// Check for `/*#__PURE__*/`
    pub(super) fn has_pure(&self, span: Span) -> bool {
        self.has_flag(span, "PURE")
    }

    fn find_comment<F>(&self, span: Span, mut op: F) -> bool
    where
        F: FnMut(&Comment) -> bool,
    {
        let mut found = false;
        if let Some(comments) = self.comments {
            let cs = comments.get_leading(span.lo);
            if let Some(cs) = cs {
                for c in &cs {
                    found |= op(c);
                    if found {
                        break;
                    }
                }
            }
        }

        found
    }

    fn has_flag(&self, span: Span, text: &'static str) -> bool {
        self.find_comment(span, |c| {
            if c.kind == CommentKind::Block {
                //
                if c.text.len() == (text.len() + 5)
                    && c.text.starts_with("#__")
                    && c.text.ends_with("__")
                    && text == &c.text[3..c.text.len() - 2]
                {
                    return true;
                }
            }

            false
        })
    }
}

impl VisitMut for InfoMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.visit_mut_children_with(self);

        if self.has_noinline(n.span) {
            n.span = n.span.apply_mark(self.marks.noinline);
        }

        if self.has_pure(n.span) {
            n.span = n.span.apply_mark(self.marks.pure);
        }
    }

    fn visit_mut_new_expr(&mut self, n: &mut NewExpr) {
        n.visit_mut_children_with(self);

        if self.has_pure(n.span) {
            n.span = n.span.apply_mark(self.marks.pure);
        }
    }

    fn visit_mut_export_default_decl(&mut self, e: &mut ExportDefaultDecl) {
        self.state.is_in_export = true;
        e.visit_mut_children_with(self);
        self.state.is_in_export = false;
    }

    fn visit_mut_export_default_expr(&mut self, e: &mut ExportDefaultExpr) {
        self.state.is_in_export = true;
        e.visit_mut_children_with(self);
        self.state.is_in_export = false;
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        n.visit_mut_children_with(self);

        if !self.state.is_in_export
            && n.function
                .params
                .iter()
                .any(|p| is_param_one_of(p, &["module", "__unused_webpack_module"]))
            && n.function.params.iter().any(|p| {
                is_param_one_of(
                    p,
                    &[
                        "exports",
                        "__webpack_require__",
                        "__webpack_exports__",
                        "__unused_webpack_exports",
                    ],
                )
            })
        {
            if is_standalone(&mut n.function, self.unresolved_mark) {
                // self.state.is_bundle = true;

                // n.function.span =
                // n.function.span.apply_mark(self.marks.standalone);
            }
        }
    }

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_lit(&mut self, _: &mut Lit) {}

    fn visit_mut_module(&mut self, m: &mut Module) {
        m.visit_mut_children_with(self);

        if self.state.is_bundle {
            tracing::info!("Running minifier in the bundle mode");
            m.span = m.span.apply_mark(self.marks.bundle_of_standalone);
        } else {
            tracing::info!("Running minifier in the normal mode");
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        n.visit_mut_children_with(self);

        if self.has_const_ann(n.span) {
            n.span = n.span.apply_mark(self.marks.const_ann);
        }
    }
}

fn is_param_one_of(p: &Param, allowed: &[&str]) -> bool {
    match &p.pat {
        Pat::Ident(i) => allowed.contains(&&*i.id.sym),
        _ => false,
    }
}

struct TopLevelBindingCollector {
    top_level_ctxt: SyntaxContext,
    bindings: Vec<Id>,
}

impl TopLevelBindingCollector {
    fn add(&mut self, id: Id) {
        if id.1 != self.top_level_ctxt {
            return;
        }

        self.bindings.push(id);
    }
}

impl Visit for TopLevelBindingCollector {
    noop_visit_type!();

    fn visit_class_decl(&mut self, v: &ClassDecl) {
        self.add(v.ident.to_id());
    }

    fn visit_fn_decl(&mut self, v: &FnDecl) {
        self.add(v.ident.to_id());
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_var_decl(&mut self, v: &VarDecl) {
        v.visit_children_with(self);
        let ids: Vec<Id> = find_ids(&v.decls);

        for id in ids {
            self.add(id)
        }
    }
}

fn is_standalone<N>(n: &mut N, unresolved_mark: Mark) -> bool
where
    N: VisitMutWith<IdentCollector>,
{
    let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);

    let bindings = {
        let mut v = IdentCollector {
            ids: Default::default(),
            for_binding: true,
            is_pat_decl: false,
        };
        n.visit_mut_with(&mut v);
        v.ids
    };

    let used = {
        let mut v = IdentCollector {
            ids: Default::default(),
            for_binding: false,
            is_pat_decl: false,
        };
        n.visit_mut_with(&mut v);
        v.ids
    };

    for used_id in &used {
        if used_id.0.starts_with("__WEBPACK_EXTERNAL_MODULE_") {
            continue;
        }

        match &*used_id.0 {
            "__webpack_require__" | "exports" => continue,
            _ => {}
        }

        if used_id.1 == unresolved_ctxt {
            // if cfg!(feature = "debug") {
            //     debug!("bundle: Ignoring {}{:?} (top level)", used_id.0,
            // used_id.1); }
            continue;
        }

        if bindings.contains(used_id) {
            // if cfg!(feature = "debug") {
            //     debug!(
            //         "bundle: Ignoring {}{:?} (local to fn)",
            //         used_id.0,
            //         used_id.1
            //     );
            // }
            continue;
        }

        trace_op!(
            "bundle: Due to {}{:?}, it's not a bundle",
            used_id.0,
            used_id.1
        );

        return false;
    }

    true
}

struct IdentCollector {
    ids: Vec<Id>,
    for_binding: bool,

    is_pat_decl: bool,
}

impl IdentCollector {
    fn add(&mut self, i: &Ident) {
        let id = i.to_id();
        self.ids.push(id);
    }
}

impl VisitMut for IdentCollector {
    noop_visit_mut_type!();

    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        c.param.visit_mut_children_with(self);
        self.is_pat_decl = old;

        self.is_pat_decl = false;
        c.body.visit_mut_with(self);

        self.is_pat_decl = old;
    }

    fn visit_mut_class_decl(&mut self, e: &mut ClassDecl) {
        if self.for_binding {
            e.ident.visit_mut_with(self);
        }

        e.class.visit_mut_with(self);
    }

    fn visit_mut_class_expr(&mut self, e: &mut ClassExpr) {
        e.class.visit_mut_with(self);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(..) if self.for_binding => {}
            _ => {
                e.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_fn_decl(&mut self, e: &mut FnDecl) {
        if self.for_binding {
            e.ident.visit_mut_with(self);
        }

        e.function.visit_mut_with(self);
    }

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        if self.for_binding {
            e.ident.visit_mut_with(self);
        }

        e.function.visit_mut_with(self);
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        self.add(&*i);
    }

    fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
        s.body.visit_mut_with(self);
    }

    fn visit_mut_param(&mut self, p: &mut Param) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        p.visit_mut_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        match p {
            Pat::Ident(..) if self.for_binding && !self.is_pat_decl => {}

            _ => {
                p.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_prop_name(&mut self, p: &mut PropName) {
        if let PropName::Computed(..) = p {
            p.visit_mut_children_with(self);
        }
    }

    fn visit_mut_var_declarator(&mut self, d: &mut VarDeclarator) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        d.name.visit_mut_with(self);

        self.is_pat_decl = false;
        d.init.visit_mut_with(self);

        self.is_pat_decl = old;
    }
}
