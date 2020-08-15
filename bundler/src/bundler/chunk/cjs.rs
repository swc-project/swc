use super::merge::Unexporter;
use crate::{bundler::load::TransformedModule, Bundler, Load, Resolve};
use anyhow::Error;
use std::{borrow::Cow, sync::atomic::Ordering};
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{ModuleItem, *};
use swc_ecma_utils::{prepend, undefined, ExprFactory};
use swc_ecma_visit::{FoldWith, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// common js module is transpiled as
    ///
    ///  Src:
    ///      const foo = require('foo');
    ///
    /// Output:
    ///
    ///      const load = __spack__require.bind(void 0, function(module,
    /// exports){
    ///      // ... body of foo
    /// });      const foo = load();
    ///
    /// As usual, this behavior depends on hygiene.
    pub(super) fn merge_cjs(
        &self,
        entry: &mut Module,
        info: &TransformedModule,
        dep: Cow<Module>,
        dep_mark: Mark,
    ) -> Result<(), Error> {
        // If src is none, all requires are transpiled
        let mut v = RequireReplacer {
            ctxt: SyntaxContext::empty().apply_mark(dep_mark),
            load_var: Ident::new("load".into(), DUMMY_SP),
            replaced: false,
        };
        entry.body.visit_mut_with(&mut v);

        if v.replaced {
            let mut load_var = v.load_var;
            if load_var.span.ctxt == SyntaxContext::empty() {
                load_var.span = load_var.span.apply_mark(Mark::fresh(Mark::root()));
            }

            {
                info.helpers.require.store(true, Ordering::SeqCst);

                let dep = dep.into_owned().fold_with(&mut Unexporter);

                prepend(
                    &mut entry.body,
                    ModuleItem::Stmt(wrap_module(self.top_level_mark, load_var, dep)),
                );

                log::warn!("Injecting load");
            }

            log::info!("Replaced requires with load");
        }

        Ok(())
    }
}

fn wrap_module(top_level_mark: Mark, load_var: Ident, dep: Module) -> Stmt {
    // ... body of foo
    let module_fn = Expr::Fn(FnExpr {
        ident: None,
        function: Function {
            params: vec![
                // module
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(Ident::new(
                        "module".into(),
                        DUMMY_SP.apply_mark(top_level_mark),
                    )),
                },
                // exports
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(Ident::new(
                        "exports".into(),
                        DUMMY_SP.apply_mark(top_level_mark),
                    )),
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
            name: Pat::Ident(load_var.clone()),
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Ident::new(
                    "__spack_require__".into(),
                    DUMMY_SP.apply_mark(top_level_mark),
                )
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

struct RequireReplacer {
    /// SyntaxContext of the dependency module.
    ctxt: SyntaxContext,
    load_var: Ident,
    replaced: bool,
}

impl VisitMut for RequireReplacer {
    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children_with(self);

        match node {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                // Replace import progress from 'progress';
                if i.span.ctxt == self.ctxt {
                    // Side effech import
                    if i.specifiers.is_empty() {
                        self.replaced = true;
                        *node = ModuleItem::Stmt(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: self.load_var.clone().as_callee(),
                                args: vec![],
                                type_args: None,
                            }
                            .into_stmt(),
                        );
                        return;
                    }

                    let mut props = vec![];
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
                                                callee: self.load_var.clone().as_callee(),
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
                            init: Some(Box::new(self.load_var.clone().into())),
                            definite: false,
                        }],
                    })));
                    return;
                }
            }
            _ => {}
        }
    }

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
                                    if self.ctxt == i.span.ctxt {
                                        let load = CallExpr {
                                            span: node.span,
                                            callee: {
                                                if self.load_var.span.ctxt == SyntaxContext::empty()
                                                {
                                                    let mut ident = self.load_var.clone();
                                                    ident.span = ident.span.with_ctxt(i.span.ctxt);
                                                    self.load_var = ident.clone();
                                                    ident.as_callee()
                                                } else {
                                                    self.load_var.clone().as_callee()
                                                }
                                            },
                                            args: vec![],
                                            type_args: None,
                                        };
                                        self.replaced = true;
                                        *node = load.clone();

                                        log::debug!("Found, and replacing require");
                                    }
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
}
