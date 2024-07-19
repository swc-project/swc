use std::{collections::HashMap, sync::atomic::Ordering};

use anyhow::Error;
use swc_common::{collections::AHashMap, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{
    bundler::{chunk::merge::Ctx, load::TransformedModule},
    modules::Modules,
    Bundler, Load, Resolve,
};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    fn make_cjs_load_var(&self, info: &TransformedModule, span: Span) -> Ident {
        Ident::new("load".into(), span, info.export_ctxt())
    }

    pub(super) fn replace_cjs_require_calls(
        &self,
        info: &TransformedModule,
        module: &mut Modules,
        is_entry: bool,
    ) {
        if !self.config.require {
            return;
        }

        let mut v = RequireReplacer {
            is_entry,
            base: info,
            bundler: self,
            replaced: false,
        };
        module.visit_mut_with(&mut v);

        if v.replaced {
            info.helpers.require.store(true, Ordering::SeqCst);
        }
    }

    /// Creates a variable named `load` (see `make_cjs_load_var`) if it's a
    /// common js module.
    pub(super) fn wrap_cjs_module(
        &self,
        ctx: &Ctx,
        info: &TransformedModule,
        mut module: Modules,
    ) -> Result<Modules, Error> {
        if !self.config.require || (!self.scope.is_cjs(info.id) && info.is_es6) {
            return Ok(module);
        }

        tracing::debug!("Merging as a common js module: {}", info.fm.name);

        let load_var = self.make_cjs_load_var(info, DUMMY_SP);

        module.visit_mut_with(&mut DefaultHandler {
            local_ctxt: info.local_ctxt(),
        });
        module.sort(info.id, &ctx.graph, &ctx.cycles, &self.cm);

        let stmt = wrap_module(
            SyntaxContext::empty(),
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            info.local_ctxt(),
            load_var,
            module.into(),
        )
        .into();

        let wrapped = Modules::from(
            info.id,
            Module {
                span: DUMMY_SP,
                body: vec![stmt],
                shebang: None,
            },
            self.injected_ctxt,
        );

        tracing::debug!("Injected a variable named `load` for a common js module");

        Ok(wrapped)
    }
}

fn wrap_module(
    helper_ctxt: SyntaxContext,
    unresolved_ctxt: SyntaxContext,
    local_ctxt: SyntaxContext,
    load_var: Ident,
    mut dep: Module,
) -> Stmt {
    {
        // Remap syntax context of `module` and `exports`
        // Those are unresolved, but it's actually an injected variable.

        let mut from = HashMap::default();
        from.insert(("module".into(), unresolved_ctxt), local_ctxt);
        from.insert(("exports".into(), unresolved_ctxt), local_ctxt);

        dep.visit_mut_with(&mut Remapper { vars: from })
    }

    // ... body of foo
    let module_fn: Expr = FnExpr {
        ident: None,
        function: Box::new(Function {
            params: vec![
                // module
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(Ident::new("module".into(), DUMMY_SP, local_ctxt).into()),
                },
                // exports
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(Ident::new("exports".into(), DUMMY_SP, local_ctxt).into()),
                },
            ],
            decorators: Vec::new(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: dep.span,
                stmts: dep
                    .body
                    .into_iter()
                    .map(|v| match v {
                        ModuleItem::ModuleDecl(i) => {
                            unreachable!("module item found but is_es6 is false: {:?}", i)
                        }
                        ModuleItem::Stmt(s) => s,
                    })
                    .collect(),
                ..Default::default()
            }),
            is_generator: false,
            is_async: false,
            ..Default::default()
        }),
    }
    .into();

    // var load = __swcpack_require__.bind(void 0, moduleDecl)

    VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(load_var.into()),
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Ident::new("__swcpack_require__".into(), DUMMY_SP, helper_ctxt)
                    .make_member(quote_ident!("bind"))
                    .as_callee(),
                args: vec![Expr::undefined(DUMMY_SP).as_arg(), module_fn.as_arg()],
                ..Default::default()
            }))),
            definite: false,
        }],
        ..Default::default()
    }
    .into()
}

struct RequireReplacer<'a, 'b, L, R>
where
    L: Load,
    R: Resolve,
{
    base: &'a TransformedModule,
    bundler: &'a Bundler<'b, L, R>,
    replaced: bool,
    is_entry: bool,
}

impl<L, R> VisitMut for RequireReplacer<'_, '_, L, R>
where
    L: Load,
    R: Resolve,
{
    noop_visit_mut_type!(fail);

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.visit_mut_children_with(self);

        if let Callee::Expr(e) = &node.callee {
            if let Expr::Ident(i) = &**e {
                // TODO: Check for global mark
                if i.sym == *"require" && node.args.len() == 1 {
                    if let Expr::Lit(Lit::Str(module_name)) = &*node.args[0].expr {
                        if self.bundler.is_external(&module_name.value) {
                            return;
                        }
                        let load = CallExpr {
                            span: node.span,
                            callee: Ident::new("load".into(), i.span, i.ctxt).as_callee(),
                            args: Vec::new(),
                            ..Default::default()
                        };
                        self.replaced = true;
                        *node = load;

                        tracing::trace!("Found, and replacing require");
                    }
                }
            }
        }
    }

    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children_with(self);

        if !self.is_entry {
            return;
        }

        if let ModuleItem::ModuleDecl(ModuleDecl::Import(i)) = node {
            let dep_module_id = self
                .base
                .imports
                .specifiers
                .iter()
                .find(|(src, _)| src.src.value == i.src.value)
                .map(|v| v.0.module_id);
            let dep_module_id = match dep_module_id {
                Some(v) => v,
                _ => {
                    return;
                }
            };
            // Replace imports iff dependency is common js module.
            let dep_module = self.bundler.scope.get_module(dep_module_id).unwrap();
            if !self.bundler.scope.is_cjs(dep_module_id) && dep_module.is_es6 {
                return;
            }

            let load_var = self.bundler.make_cjs_load_var(&dep_module, i.span);
            // Replace import progress from 'progress';
            // Side effect import
            if i.specifiers.is_empty() {
                self.replaced = true;
                *node = CallExpr {
                    span: DUMMY_SP,
                    callee: load_var.as_callee(),
                    args: Vec::new(),

                    ..Default::default()
                }
                .into_stmt()
                .into();
                return;
            }

            let mut props = Vec::new();
            // TODO
            for spec in i.specifiers.clone() {
                match spec {
                    ImportSpecifier::Named(s) => match s.imported {
                        Some(ModuleExportName::Ident(imported)) => {
                            props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: imported.into(),
                                value: Box::new(s.local.into()),
                            }));
                        }
                        Some(ModuleExportName::Str(..)) => {
                            unimplemented!("module string names unimplemented")
                        }
                        _ => {
                            props.push(ObjectPatProp::Assign(AssignPatProp {
                                span: s.span,
                                key: s.local.into(),
                                value: None,
                            }));
                        }
                    },
                    ImportSpecifier::Default(s) => {
                        props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(IdentName::new("default".into(), DUMMY_SP)),
                            value: Box::new(s.local.into()),
                        }));
                    }
                    ImportSpecifier::Namespace(ns) => {
                        self.replaced = true;
                        *node = VarDecl {
                            span: i.span,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: ns.span,
                                name: ns.local.into(),
                                init: Some(Box::new(
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: load_var.as_callee(),
                                        args: Vec::new(),

                                        ..Default::default()
                                    }
                                    .into(),
                                )),
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into();
                        return;
                    }
                }
            }

            self.replaced = true;
            *node = VarDecl {
                span: i.span,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: i.span,
                    name: Pat::Object(ObjectPat {
                        span: DUMMY_SP,
                        props,
                        optional: false,
                        type_ann: None,
                    }),
                    init: Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: load_var.as_callee(),
                        args: Vec::new(),
                        ..Default::default()
                    }))),
                    definite: false,
                }],
                ..Default::default()
            }
            .into();
        }
    }
}

struct DefaultHandler {
    local_ctxt: SyntaxContext,
}

impl VisitMut for DefaultHandler {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Ident(i) = e {
            if i.sym == "default" {
                *e = MemberExpr {
                    span: i.span,
                    obj: Ident::new("module".into(), DUMMY_SP, self.local_ctxt).into(),
                    prop: MemberProp::Ident(quote_ident!("exports")),
                }
                .into();
            }
        }
    }
}

struct Remapper {
    vars: AHashMap<Id, SyntaxContext>,
}

impl VisitMut for Remapper {
    noop_visit_mut_type!(fail);

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if let Some(v) = self.vars.get(&i.to_id()).copied() {
            i.ctxt = v;
        }
    }
}
