use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    find_pat_ids, private_ident, quote_ident, stack_size::maybe_grow_default, ExprFactory,
    ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn explicit_resource_management() -> impl Pass {
    visit_mut_pass(ExplicitResourceManagement::default())
}

#[derive(Default)]
struct ExplicitResourceManagement {
    state: Option<State>,

    is_not_top_level: bool,

    /// `true` while visiting the body of a TypeScript namespace.
    ///
    /// A namespace body can not contain ESM exports, so export declarations
    /// in it are not rewritten to `export { ... }`. The swc pipeline lowers
    /// namespaces before this pass, so this only matters when the pass runs
    /// on TypeScript input.
    in_ts_namespace: bool,
}

struct State {
    env: Ident,
    has_await: bool,

    vars: Vec<(Pat, Box<Expr>)>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            env: private_ident!("env"),
            has_await: false,
            vars: Vec::new(),
        }
    }
}

impl ExplicitResourceManagement {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
        Vec<T>: VisitMutWith<Self>,
    {
        let old_state = self.state.take();

        stmts.visit_mut_children_with(self);

        if let Some(state) = self.state.take() {
            self.wrap_with_try(state, stmts);
        }

        self.state = old_state;
    }

    fn wrap_with_try<T>(&mut self, state: State, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike,
    {
        // Items that must run before the `try` block.
        let mut hoisted = Vec::new();
        let mut new = Vec::new();
        let mut extras = Vec::new();
        // Names of exported classes, and of the exported enums and namespaces
        // moved into the `try` block. TypeScript merges an enum or a namespace
        // with an earlier declaration of the same name, and the name must be
        // exported only once.
        let mut exported_names: Vec<Id> = Vec::new();
        // Names of the top-level functions, which stay at the top level.
        let mut fn_names: Vec<Id> = Vec::new();

        let env = state.env;
        let catch_e = private_ident!("e");

        let is_async = state.has_await;

        // const env_1 = { stack: [], error: void 0, hasError: false };
        new.push(T::from(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(env.clone().into()),
                init: Some(Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("stack")),
                            value: Box::new(Expr::Array(ArrayLit {
                                span: DUMMY_SP,
                                elems: vec![],
                            })),
                        }))),
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("error")),
                            value: Expr::undefined(DUMMY_SP),
                        }))),
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("hasError")),
                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: false,
                            }))),
                        }))),
                    ],
                }))),
                definite: false,
            }],
            ..Default::default()
        })))));

        let mut try_block = BlockStmt {
            stmts: vec![],
            ..Default::default()
        };

        for (name, disposable) in state.vars {
            let init_var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name,
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_add_disposable_resource),
                            args: vec![
                                env.clone().as_arg(),
                                disposable.as_arg(),
                                is_async.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                }],
                ..Default::default()
            })));

            try_block.stmts.push(init_var_decl);
        }

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(mut stmt) => match stmt {
                    // top level function declarations should preserve original
                    // level
                    Stmt::Decl(Decl::Fn(ref f)) if !self.is_not_top_level => {
                        fn_names.push(f.ident.to_id());
                        extras.push(stmt.into());
                    }
                    Stmt::Decl(Decl::Class(ClassDecl { ident, class, .. }))
                        if !self.is_not_top_level =>
                    {
                        // var C = class C { ... };
                        try_block.stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone().into()),
                                init: Some(
                                    ClassExpr {
                                        ident: Some(ident),
                                        class,
                                    }
                                    .into(),
                                ),
                                definite: false,
                            }],
                            ..Default::default()
                        }))));
                    }
                    // top level variable declarations should hoist from inner
                    // scope
                    Stmt::Decl(Decl::Var(ref mut var)) if !self.is_not_top_level => {
                        var.kind = VarDeclKind::Var;
                        try_block.stmts.push(stmt);
                    }
                    _ => {
                        try_block.stmts.push(stmt);
                    }
                },
                Err(t) if self.in_ts_namespace => extras.push(t),
                Err(t) => match t.try_into_module_decl() {
                    Ok(ModuleDecl::ExportDecl(ExportDecl {
                        decl: Decl::Class(ClassDecl { ident, class, .. }),
                        span,
                    })) => {
                        exported_names.push(ident.to_id());

                        // export { C };
                        extras.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                specifiers: vec![ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ident.clone().into(),
                                    exported: None,
                                    is_type_only: false,
                                }
                                .into()],
                                ..NamedExport::dummy()
                            }))
                            .unwrap(),
                        );

                        // var C = class C { ... };
                        try_block.stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone().into()),
                                init: Some(
                                    ClassExpr {
                                        ident: Some(ident),
                                        class,
                                    }
                                    .into(),
                                ),
                                definite: false,
                            }],
                            span,
                            ..Default::default()
                        }))));
                    }
                    Ok(ModuleDecl::ExportDecl(ExportDecl {
                        decl: Decl::Var(mut var),
                        span,
                    })) if !var.declare => {
                        // The declaration must be evaluated inside the `try`
                        // block, before the resources
                        // are disposed, so it can not stay as an export
                        // declaration after the `finally` block. An ambient
                        // (`declare`) declaration has no runtime binding to
                        // export, so it is kept as is.
                        //
                        // export { a, b };
                        extras.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                specifiers: find_pat_ids::<_, Ident>(&var.decls)
                                    .into_iter()
                                    .map(|id| {
                                        ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: id.into(),
                                            exported: None,
                                            is_type_only: false,
                                        }
                                        .into()
                                    })
                                    .collect(),
                                ..NamedExport::dummy()
                            }))
                            .unwrap(),
                        );

                        // var a = 1, b = 2;
                        var.span = span;
                        var.kind = VarDeclKind::Var;
                        try_block.stmts.push(Stmt::Decl(Decl::Var(var)));
                    }
                    Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                        decl: DefaultDecl::Class(class_expr),
                        span,
                        ..
                    })) => {
                        let ident = class_expr
                            .ident
                            .clone()
                            .unwrap_or_else(|| private_ident!("_default"));

                        // export { C as default };
                        extras.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                specifiers: vec![ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ident.clone().into(),
                                    exported: Some(quote_ident!("default").into()),
                                    is_type_only: false,
                                }
                                .into()],
                                ..NamedExport::dummy()
                            }))
                            .unwrap(),
                        );

                        // var C = class { ... };

                        try_block.stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.into()),
                                init: Some(class_expr.into()),
                                definite: false,
                            }],
                            span,
                            ..Default::default()
                        }))));
                    }
                    Ok(ModuleDecl::ExportDefaultExpr(export))
                        if is_kept_default_expr(&export.expr) =>
                    {
                        extras.push(
                            T::try_from_module_decl(ModuleDecl::ExportDefaultExpr(export)).unwrap(),
                        );
                    }
                    Ok(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr { expr, span })) => {
                        // The expression must be evaluated in source order,
                        // before the resources are disposed.
                        let ident = private_ident!("_default");

                        // export { _default as default };
                        extras.push(
                            T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                specifiers: vec![ExportNamedSpecifier {
                                    span: DUMMY_SP,
                                    orig: ident.clone().into(),
                                    exported: Some(quote_ident!("default").into()),
                                    is_type_only: false,
                                }
                                .into()],
                                ..NamedExport::dummy()
                            }))
                            .unwrap(),
                        );

                        // var _default = expr;
                        try_block.stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.into()),
                                init: Some(expr),
                                definite: false,
                            }],
                            span,
                            ..Default::default()
                        }))));
                    }
                    Ok(ModuleDecl::TsImportEquals(import))
                        if matches!(import.module_ref, TsModuleRef::TsExternalModuleRef(..)) =>
                    {
                        // `import x = require("y")` is kept by the TypeScript
                        // transform for the CommonJS transform, and it can
                        // not be put in a block. Load the module before the
                        // `try` block, as an ES import would be, so the
                        // declarations in the block can use it.
                        hoisted.push(
                            T::try_from_module_decl(ModuleDecl::TsImportEquals(import)).unwrap(),
                        );
                    }
                    Ok(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                        if ts_runtime_decl_ident(&decl)
                            .is_some_and(|id| !fn_names.contains(&id.to_id())) =>
                    {
                        // The transform gets TypeScript input when a caller
                        // runs it before the TypeScript transform. Enums and
                        // namespaces initialize their bindings at runtime, so
                        // they move into the `try` block with the other
                        // declarations. The TypeScript transform lowers them
                        // there.
                        //
                        // A namespace that merges with a function stays at the
                        // top level. The function is a lexical declaration of
                        // the module, and the `var` that the TypeScript
                        // transform declares for the namespace in the block
                        // would conflict with it. Known limitation: such a
                        // namespace is initialized after the resources are
                        // disposed, and after the exported declarations that
                        // follow it.
                        let ident = ts_runtime_decl_ident(&decl).unwrap().clone();

                        if !exported_names.contains(&ident.to_id()) {
                            exported_names.push(ident.to_id());

                            // export { E };
                            extras.push(
                                T::try_from_module_decl(ModuleDecl::ExportNamed(NamedExport {
                                    specifiers: vec![ExportNamedSpecifier {
                                        span: DUMMY_SP,
                                        orig: ident.into(),
                                        exported: None,
                                        is_type_only: false,
                                    }
                                    .into()],
                                    ..NamedExport::dummy()
                                }))
                                .unwrap(),
                            );
                        }

                        try_block.stmts.push(Stmt::Decl(decl));
                    }
                    Ok(module_decl) => {
                        if let ModuleDecl::ExportDecl(ExportDecl {
                            decl: Decl::Fn(f), ..
                        }) = &module_decl
                        {
                            fn_names.push(f.ident.to_id());
                        }

                        extras.push(T::try_from_module_decl(module_decl).unwrap());
                    }
                    Err(t) => extras.push(t),
                },
            }
        }

        let catch_clause = CatchClause {
            span: DUMMY_SP,
            param: Some(Pat::Ident(catch_e.clone().into())),
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    // env.e = e;
                    AssignExpr {
                        span: DUMMY_SP,
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(env.clone().into()),
                            prop: MemberProp::Ident(quote_ident!("error")),
                        }
                        .into(),
                        op: op!("="),
                        right: Box::new(catch_e.clone().into()),
                    }
                    .into_stmt(),
                    // env.hasError = true;
                    AssignExpr {
                        span: DUMMY_SP,
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(env.clone().into()),
                            prop: MemberProp::Ident(quote_ident!("hasError")),
                        }
                        .into(),
                        op: op!("="),
                        right: Box::new(Expr::Lit(Lit::Bool(Bool {
                            span: DUMMY_SP,
                            value: true,
                        }))),
                    }
                    .into_stmt(),
                ],
                ..Default::default()
            },
        };

        let finally_block = if is_async {
            // Code:
            // const result_1 = _ts_dispose_resources(env_1);
            // if (result_1)
            //      await result_1;

            let result = private_ident!("result");

            let var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                kind: VarDeclKind::Const,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(result.clone().into()),
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_dispose_resources),
                            args: vec![env.clone().as_arg()],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                }],
                ..Default::default()
            })));
            let if_stmt = Stmt::If(IfStmt {
                span: DUMMY_SP,
                test: result.clone().into(),
                // Code:
                //      await result_1;
                cons: Stmt::Expr(ExprStmt {
                    expr: Box::new(Expr::Await(AwaitExpr {
                        arg: result.clone().into(),
                        ..Default::default()
                    })),
                    ..Default::default()
                })
                .into(),
                ..Default::default()
            });

            vec![var_decl, if_stmt]
        } else {
            // Code:
            // _ts_dispose_resources(env_1);
            vec![CallExpr {
                callee: helper!(ts, ts_dispose_resources),
                args: vec![env.clone().as_arg()],
                ..Default::default()
            }
            .into_stmt()]
        };

        let try_stmt = TryStmt {
            span: DUMMY_SP,
            block: try_block,
            handler: Some(catch_clause),
            finalizer: Some(BlockStmt {
                stmts: finally_block,
                ..Default::default()
            }),
        };

        new.push(T::from(try_stmt.into()));
        new.extend(extras);

        hoisted.extend(new);
        *stmts = hoisted;
    }
}

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        maybe_grow_default(|| n.visit_mut_children_with(self));
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.visit_mut_children_with(self);

        if let ForHead::UsingDecl(using) = &mut n.left {
            let mut state = State::default();
            state.has_await |= using.is_await;

            let mut inner_var_decl = VarDecl {
                kind: VarDeclKind::Const,
                ..Default::default()
            };

            for decl in &mut using.decls {
                let new_var = private_ident!("_");

                inner_var_decl.decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: decl.name.take(),
                    init: Some(
                        CallExpr {
                            callee: helper!(ts, ts_add_disposable_resource),
                            args: vec![
                                state.env.clone().as_arg(),
                                new_var.clone().as_arg(),
                                using.is_await.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into(),
                    ),
                    definite: false,
                });

                decl.name = Pat::Ident(new_var.clone().into());
            }

            let var_decl = Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: using.decls.take(),
                ..Default::default()
            });

            let mut body = vec![
                Stmt::Decl(Decl::Var(Box::new(inner_var_decl))),
                *n.body.take(),
            ];
            self.wrap_with_try(state, &mut body);

            n.left = ForHead::VarDecl(var_decl);
            *n.body = BlockStmt {
                span: DUMMY_SP,
                stmts: body,
                ..Default::default()
            }
            .into()
        }
    }

    fn visit_mut_ts_module_block(&mut self, n: &mut TsModuleBlock) {
        let old_in_ts_namespace = self.in_ts_namespace;
        self.in_ts_namespace = true;
        n.visit_mut_children_with(self);
        self.in_ts_namespace = old_in_ts_namespace;
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(stmts)
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        maybe_grow_default(|| s.visit_mut_children_with(self));

        if let Stmt::Decl(Decl::Using(using)) = s {
            let state = self.state.get_or_insert_with(Default::default);

            let decl = handle_using_decl(using, state);
            if decl.decls.is_empty() {
                s.take();
                return;
            }

            *s = Stmt::Decl(Decl::Var(decl));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_is_not_top_level = self.is_not_top_level;
        self.is_not_top_level = true;
        self.visit_mut_stmt_likes(stmts);
        self.is_not_top_level = old_is_not_top_level;
    }
}

/// Returns the name of a TypeScript enum or namespace that has runtime code.
fn ts_runtime_decl_ident(decl: &Decl) -> Option<&Ident> {
    match decl {
        Decl::TsEnum(e) if !e.declare => Some(&e.id),
        Decl::TsModule(m) if !m.declare => match &m.id {
            TsModuleName::Ident(id) => Some(id),
            TsModuleName::Str(..) => None,
        },
        _ => None,
    }
}

/// Returns `true` if `export default <expr>` can stay after the `finally`
/// block.
///
/// - Evaluating an identifier, a function, or an arrow function has no side
///   effects, so the position of the export does not change the order of side
///   effects.
/// - An anonymous function or class gets the name `"default"` only from `export
///   default`. Assigning it to a variable would change its `name`. Known
///   limitation: an anonymous class expression is kept for its name, so its
///   static initializers still run after the resources are disposed.
/// - An identifier can refer to a type. The TypeScript transform removes
///   `export default <type>`, but not `var _default = <type>`.
fn is_kept_default_expr(expr: &Expr) -> bool {
    matches!(
        expr.unwrap_parens(),
        Expr::Ident(..)
            | Expr::Fn(..)
            | Expr::Arrow(..)
            | Expr::Class(ClassExpr { ident: None, .. })
    )
}

fn handle_using_decl(using: &mut UsingDecl, state: &mut State) -> Box<VarDecl> {
    state.has_await |= using.is_await;

    for decl in &mut using.decls {
        decl.init = Some(
            CallExpr {
                callee: helper!(ts, ts_add_disposable_resource),
                args: vec![
                    state.env.clone().as_arg(),
                    decl.init.take().unwrap().as_arg(),
                    using.is_await.as_arg(),
                ],
                ..Default::default()
            }
            .into(),
        );
    }

    Box::new(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Const,
        declare: false,
        decls: using.decls.take(),
        ..Default::default()
    })
}
