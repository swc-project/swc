use super::merge::Unexporter;
use crate::modules::Modules;
use crate::{
    bundler::{
        chunk::{merge::Ctx, plan::Dependancy},
        load::TransformedModule,
    },
    Bundler, Load, Resolve,
};
use anyhow::Error;
use std::sync::atomic::Ordering;
use swc_atoms::js_word;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{ModuleItem, *};
use swc_ecma_utils::{quote_ident, undefined, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// common js module is transpiled as
    ///
    ///  Src:
    ///
    /// ```ts
    ///      const foo = require('foo');
    /// ```
    ///
    /// Output:
    /// ```ts
    ///     const load = __spack__require.bind(void 0, function(module, exports){
    ///         // ... body of foo
    ///     });
    ///     const foo = load();
    /// ```
    /// As usual, this behavior depends on hygiene.
    ///
    /// # Parameters
    ///
    /// If `is_entry` is true, you can use import statement to import common js
    /// modules.
    pub(super) fn merge_cjs(
        &self,
        ctx: &Ctx,
        is_entry: bool,
        entry: &mut Modules,
        info: &TransformedModule,
        dep: Modules,
        dep_info: &TransformedModule,
        targets: &mut Vec<Dependancy>,
    ) -> Result<(), Error> {
        if info.is_es6 && dep_info.is_es6 {
            return Ok(());
        }

        log::debug!("Merging as a common js module: {}", info.fm.name);
        // If src is none, all requires are transpiled
        let mut v = RequireReplacer {
            is_entry,
            ctxt: dep_info.export_ctxt(),
            load_var: Ident::new("load".into(), DUMMY_SP.with_ctxt(dep_info.export_ctxt())),
            replaced: false,
        };
        entry.visit_mut_with(&mut v);

        if v.replaced {
            if let Some(idx) = targets.iter().position(|v| v.id == dep_info.id) {
                targets.remove(idx);
            }

            let load_var = v.load_var;

            {
                info.helpers.require.store(true, Ordering::SeqCst);

                let mut dep = dep.fold_with(&mut Unexporter);
                drop_module_decls(&mut dep);
                dep.visit_mut_with(&mut DefaultHandler {
                    local_ctxt: dep_info.local_ctxt(),
                });
                dep.sort(info.id, &ctx.graph, &self.cm);

                entry.prepend(
                    info.id,
                    ModuleItem::Stmt(wrap_module(
                        SyntaxContext::empty(),
                        dep_info.local_ctxt(),
                        load_var,
                        dep.into(),
                    )),
                );

                log::warn!("Injecting load");
            }

            if let Some(normal_plan) = ctx.plan.normal.get(&dep_info.id) {
                for dep in normal_plan.chunks.iter() {
                    if !targets.contains(&dep) {
                        continue;
                    }

                    let dep_info = self.scope.get_module(dep.id).unwrap();
                    self.merge_cjs(
                        ctx,
                        false,
                        entry,
                        info,
                        Modules::from(dep_info.id, (*dep_info.module).clone(), self.injected_ctxt),
                        &dep_info,
                        targets,
                    )?;
                }
            }
        }

        Ok(())
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

struct RequireReplacer {
    /// SyntaxContext of the dependency module.
    ctxt: SyntaxContext,
    load_var: Ident,
    replaced: bool,
    is_entry: bool,
}

impl VisitMut for RequireReplacer {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children_with(self);

        if !self.is_entry {
            return;
        }

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
                            init: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: self.load_var.clone().as_callee(),
                                type_args: None,
                                args: vec![],
                            }))),
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
                                            callee: self.load_var.clone().as_callee(),
                                            args: vec![],
                                            type_args: None,
                                        };
                                        self.replaced = true;
                                        *node = load.clone();

                                        log::trace!("Found, and replacing require");
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

fn drop_module_decls(modules: &mut Modules) {
    modules.retain_mut(|_, i| match i {
        ModuleItem::ModuleDecl(..) => false,
        ModuleItem::Stmt(_) => true,
    })
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
