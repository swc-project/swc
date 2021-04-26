use crate::modules::Modules;
use crate::{
    bundler::{chunk::merge::Ctx, load::TransformedModule},
    Bundler, Load, Resolve,
};
use anyhow::Error;
use std::sync::atomic::Ordering;
use swc_atoms::js_word;
use swc_common::Span;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{ModuleItem, *};
use swc_ecma_utils::{quote_ident, undefined, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    fn make_cjs_load_var(&self, info: &TransformedModule, span: Span) -> Ident {
        Ident::new("load".into(), span.with_ctxt(info.export_ctxt()))
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

        log::debug!("Merging as a common js module: {}", info.fm.name);

        let load_var = self.make_cjs_load_var(info, DUMMY_SP);

        module.visit_mut_with(&mut DefaultHandler {
            local_ctxt: info.local_ctxt(),
        });
        module.sort(info.id, &ctx.graph, &ctx.cycles, &self.cm);

        let stmt = ModuleItem::Stmt(wrap_module(
            SyntaxContext::empty(),
            info.local_ctxt(),
            load_var,
            module.into(),
        ));

        let wrapped = Modules::from(
            info.id,
            Module {
                span: DUMMY_SP,
                body: vec![stmt],
                shebang: None,
            },
            self.injected_ctxt,
        );

        log::debug!("Injected a variable named `load` for a common js module");

        Ok(wrapped)
    }
}

fn wrap_module(
    helper_ctxt: SyntaxContext,
    local_ctxt: SyntaxContext,
    load_var: Ident,
    dep: Module,
) -> Stmt {
    // ... body of foo
    let module_fn = Expr::Fn(FnExpr {
        ident: None,
        function: Function {
            params: vec![
                // module
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(
                        Ident::new("module".into(), DUMMY_SP.with_ctxt(local_ctxt)).into(),
                    ),
                },
                // exports
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(
                        Ident::new("exports".into(), DUMMY_SP.with_ctxt(local_ctxt)).into(),
                    ),
                },
            ],
            decorators: vec![],
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
            }),
            is_generator: false,
            is_async: false,
            type_params: None,
            return_type: None,
        },
    });

    // var load = __spack_require__.bind(void 0, moduleDecl)
    let load_var_init = Stmt::Decl(Decl::Var(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(load_var.clone().into()),
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Ident::new("__spack_require__".into(), DUMMY_SP.with_ctxt(helper_ctxt))
                    .make_member(Ident::new("bind".into(), DUMMY_SP))
                    .as_callee(),
                args: vec![undefined(DUMMY_SP).as_arg(), module_fn.as_arg()],
                type_args: None,
            }))),
            definite: false,
        }],
    }));

    load_var_init
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
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.visit_mut_children_with(self);

        match &node.callee {
            ExprOrSuper::Expr(e) => {
                match &**e {
                    Expr::Ident(i) => {
                        // TODO: Check for global mark
                        if i.sym == *"require" && node.args.len() == 1 {
                            match &*node.args[0].expr {
                                Expr::Lit(Lit::Str(..)) => {
                                    let load = CallExpr {
                                        span: node.span,
                                        callee: Ident::new("load".into(), i.span).as_callee(),
                                        args: vec![],
                                        type_args: None,
                                    };
                                    self.replaced = true;
                                    *node = load.clone();

                                    log::trace!("Found, and replacing require");
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children_with(self);

        if !self.is_entry {
            return;
        }

        match node {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
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
                // Side effech import
                if i.specifiers.is_empty() {
                    self.replaced = true;
                    *node = ModuleItem::Stmt(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: load_var.clone().as_callee(),
                            args: vec![],
                            type_args: None,
                        }
                        .into_stmt(),
                    );
                    return;
                }

                let mut props = vec![];
                // TODO
                for spec in i.specifiers.clone() {
                    match spec {
                        ImportSpecifier::Named(s) => {
                            if let Some(imported) = s.imported {
                                props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                    key: imported.into(),
                                    value: Box::new(s.local.into()),
                                }));
                            } else {
                                props.push(ObjectPatProp::Assign(AssignPatProp {
                                    span: s.span,
                                    key: s.local,
                                    value: None,
                                }));
                            }
                        }
                        ImportSpecifier::Default(s) => {
                            props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(Ident::new("default".into(), DUMMY_SP)),
                                value: Box::new(s.local.into()),
                            }));
                        }
                        ImportSpecifier::Namespace(ns) => {
                            self.replaced = true;
                            *node = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: i.span,
                                kind: VarDeclKind::Var,
                                declare: false,
                                decls: vec![VarDeclarator {
                                    span: ns.span,
                                    name: ns.local.into(),
                                    init: Some(Box::new(
                                        CallExpr {
                                            span: DUMMY_SP,
                                            callee: load_var.clone().as_callee(),
                                            args: vec![],
                                            type_args: None,
                                        }
                                        .into(),
                                    )),
                                    definite: false,
                                }],
                            })));
                            return;
                        }
                    }
                }

                self.replaced = true;
                *node = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
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
                            callee: load_var.clone().as_callee(),
                            type_args: None,
                            args: vec![],
                        }))),
                        definite: false,
                    }],
                })));
                return;
            }
            _ => {}
        }
    }
}

struct DefaultHandler {
    local_ctxt: SyntaxContext,
}

impl VisitMut for DefaultHandler {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                if i.sym == js_word!("default") {
                    *e = Expr::Member(MemberExpr {
                        span: i.span,
                        obj: ExprOrSuper::Expr(Box::new(Expr::Ident(Ident::new(
                            "module".into(),
                            DUMMY_SP.with_ctxt(self.local_ctxt),
                        )))),
                        prop: Box::new(Expr::Ident(quote_ident!("exports"))),
                        computed: false,
                    });
                    return;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }
}
