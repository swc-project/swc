use std::collections::hash_map::Entry;

use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    errors::HANDLER,
    Span, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn duplicate_bindings() -> Box<dyn Rule> {
    visitor_rule(DuplicateBindings::default())
}

#[derive(Debug, Default, Clone, Copy)]
struct BindingInfo {
    span: Span,
    ctxt: SyntaxContext,
    unique: bool,
    is_function: bool,
}

#[derive(Debug, Default)]
struct DuplicateBindings {
    bindings: AHashMap<Id, BindingInfo>,
    type_bindings: AHashSet<Id>,

    var_decl_kind: Option<VarDeclKind>,
    is_pat_decl: bool,

    /// at the top level of script of function, function behaves like var
    /// in other scope it behaves like let
    lexical_function: bool,
}

impl DuplicateBindings {
    /// Add a binding.
    fn add(&mut self, id: JsWord, info: BindingInfo) {
        match self.bindings.entry((id.clone(), info.ctxt)) {
            Entry::Occupied(mut prev) => {
                if !(info.is_function && prev.get().is_function)
                    && (info.unique || prev.get().unique)
                {
                    emit_error(&id, info.span, prev.get().span);
                }

                // Next span.
                if info.unique || !prev.get().unique {
                    *prev.get_mut() = info
                }
            }
            Entry::Vacant(e) => {
                e.insert(info);
            }
        }
    }

    /// `const` or `let`
    fn is_unique_var_kind(&self) -> bool {
        matches!(
            self.var_decl_kind,
            Some(VarDeclKind::Const) | Some(VarDeclKind::Let)
        )
    }

    fn visit_with_kind<V: VisitWith<Self>>(&mut self, e: &V, kind: Option<VarDeclKind>) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = kind;
        self.is_pat_decl = true;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    // this is for the wired case:
    // in non strict mode, function in non top level or function scope
    // is hoisted, while still error when collides with same level lexical var
    fn visit_with_stmt_like<T: VisitWith<Self>, F: Fn(&T) -> Option<Ident>>(
        &mut self,
        s: &[T],
        get_fn_ident: F,
    ) {
        let mut fn_name = AHashMap::default();
        for s in s {
            if let Some(ident) = get_fn_ident(s) {
                if let Some(prev) = fn_name.get(&ident.sym) {
                    emit_error(&ident.sym, ident.span, *prev)
                } else {
                    fn_name.insert(ident.sym.clone(), ident.span);
                }
            }

            s.visit_with(self);
        }
    }

    fn visit_with_stmts(&mut self, s: &[Stmt], lexical_function: bool) {
        let old = self.lexical_function;
        self.lexical_function = lexical_function;

        if lexical_function {
            self.visit_with_stmt_like(s, |s| match s {
                Stmt::Decl(Decl::Fn(FnDecl {
                    ident, function: f, ..
                })) if f.body.is_some() => Some(ident.clone()),
                _ => None,
            });
        } else {
            s.visit_children_with(self);
        }
        self.lexical_function = old;
    }
}

impl Visit for DuplicateBindings {
    noop_visit_type!();

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add(
                p.key.sym.clone(),
                BindingInfo {
                    span: p.key.span,
                    ctxt: p.key.ctxt,
                    unique: self.is_unique_var_kind(),
                    is_function: false,
                },
            );
        }
    }

    fn visit_function(&mut self, f: &Function) {
        // in case any new parts is added
        let Function {
            body,
            params,
            decorators,
            ..
        } = f;
        params.visit_with(self);
        decorators.visit_with(self);
        if let Some(body) = body {
            self.visit_with_stmts(&body.stmts, false)
        }
    }

    fn visit_arrow_expr(&mut self, a: &ArrowExpr) {
        let ArrowExpr { params, body, .. } = a;
        params.visit_with(self);
        if let BlockStmtOrExpr::BlockStmt(b) = &**body {
            self.visit_with_stmts(&b.stmts, false)
        }
    }

    fn visit_static_block(&mut self, c: &StaticBlock) {
        self.visit_with_stmts(&c.body.stmts, false)
    }

    // block stmt and case block
    fn visit_stmts(&mut self, b: &[Stmt]) {
        self.visit_with_stmts(b, true)
    }

    fn visit_catch_clause(&mut self, c: &CatchClause) {
        self.visit_with_kind(c, Some(VarDeclKind::Var))
    }

    fn visit_class_decl(&mut self, d: &ClassDecl) {
        if d.declare {
            return;
        }

        self.add(
            d.ident.sym.clone(),
            BindingInfo {
                span: d.ident.span,
                ctxt: d.ident.ctxt,
                unique: true,
                is_function: false,
            },
        );

        d.visit_children_with(self);
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = None;
        self.is_pat_decl = false;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_fn_decl(&mut self, d: &FnDecl) {
        if d.function.body.is_none() || d.declare {
            return;
        }

        self.add(
            d.ident.sym.clone(),
            BindingInfo {
                span: d.ident.span,
                ctxt: d.ident.ctxt,
                unique: self.lexical_function,
                is_function: true,
            },
        );

        d.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, s: &ImportDecl) {
        if s.type_only {
            return;
        }

        s.visit_children_with(self);
    }

    fn visit_export_default_decl(&mut self, e: &ExportDefaultDecl) {
        // export default function foo() {} should be treated as hoisted
        match &e.decl {
            DefaultDecl::Class(ClassExpr {
                ident: Some(ident), ..
            }) => self.add(
                ident.sym.clone(),
                BindingInfo {
                    span: ident.span,
                    ctxt: ident.ctxt,
                    unique: true,
                    is_function: false,
                },
            ),
            DefaultDecl::Fn(FnExpr {
                ident: Some(ident),
                function: f,
                ..
            }) if f.body.is_some() => self.add(
                ident.sym.clone(),
                BindingInfo {
                    span: ident.span,
                    ctxt: ident.ctxt,
                    unique: self.lexical_function,
                    is_function: true,
                },
            ),
            _ => {}
        }

        e.visit_children_with(self);
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier) {
        s.visit_children_with(self);

        if !s.is_type_only && !self.type_bindings.contains(&s.local.to_id()) {
            self.add(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_ts_import_equals_decl(&mut self, s: &TsImportEqualsDecl) {
        s.visit_children_with(self);

        if !s.is_type_only && !self.type_bindings.contains(&s.id.to_id()) {
            self.add(
                s.id.sym.clone(),
                BindingInfo {
                    span: s.id.span,
                    ctxt: s.id.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_module(&mut self, m: &Module) {
        m.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        self.lexical_function = true;

        self.visit_with_stmt_like(&m.body, |s| match s {
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                ident, function: f, ..
            })))
            | ModuleItem::ModuleDecl(
                ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Fn(FnDecl {
                            ident, function: f, ..
                        }),
                    ..
                })
                | ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            ident: Some(ident),
                            function: f,
                        }),
                    ..
                }),
            ) if f.body.is_some() => Some(ident.clone()),
            _ => None,
        });
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(p) = p {
            if self.is_pat_decl {
                self.add(
                    p.sym.clone(),
                    BindingInfo {
                        span: p.span,
                        ctxt: p.ctxt,
                        unique: self.is_unique_var_kind(),
                        is_function: false,
                    },
                );
            }
        }
    }

    fn visit_script(&mut self, s: &Script) {
        s.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        s.body.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, d: &VarDecl) {
        if d.declare {
            return;
        }

        self.visit_with_kind(d, Some(d.kind))
    }

    fn visit_param(&mut self, p: &Param) {
        self.visit_with_kind(p, Some(VarDeclKind::Var))
    }
}

struct TypeCollector<'a> {
    type_bindings: &'a mut AHashSet<Id>,
}

impl Visit for TypeCollector<'_> {
    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        n.visit_children_with(self);

        if let TsEntityName::Ident(ident) = n {
            self.type_bindings.insert(ident.to_id());
        }
    }
}

#[cold]
fn emit_error(name: &str, span: Span, prev_span: Span) {
    HANDLER.with(|handler| {
        handler
            .struct_span_err(
                span,
                &format!("the name `{}` is defined multiple times", name),
            )
            .span_label(prev_span, format!("previous definition of `{}` here", name))
            .span_label(span, format!("`{}` redefined here", name))
            .emit();
    });
}
