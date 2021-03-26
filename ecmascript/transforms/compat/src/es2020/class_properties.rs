use self::{
    class_name_tdz::ClassNameTdzFolder,
    private_field::FieldAccessFolder,
    this_in_static::ThisInStaticFolder,
    used_name::{UsedNameCollector, UsedNameRenamer},
};
use crate::es2015::classes::SuperFieldAccessFolder;
use std::{collections::HashSet, mem::take};
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, constructor::inject_after_super, default_constructor,
    undefined, ExprFactory, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

mod class_name_tdz;
mod private_field;
mod this_in_static;
mod used_name;

///
///
///
///
/// # Impl note
///
/// We use custom helper to handle export default class
pub fn class_properties() -> impl Fold {
    ClassProperties {
        typescript: false,
        mark: Mark::root(),
    }
}

/// Class properties pass for the typescript.
#[deprecated = "The logic is merged into typescript::strip"]
pub fn typescript_class_properties() -> impl Fold {
    ClassProperties {
        typescript: true,
        mark: Mark::root(),
    }
}

#[derive(Clone)]
struct ClassProperties {
    typescript: bool,
    mark: Mark,
}

#[fast_path(ShouldWork)]
impl Fold for ClassProperties {
    noop_fold_type!();

    fn fold_ident(&mut self, i: Ident) -> Ident {
        Ident {
            optional: false,
            ..i
        }
    }
    fn fold_array_pat(&mut self, p: ArrayPat) -> ArrayPat {
        ArrayPat {
            optional: false,
            ..p.fold_children_with(self)
        }
    }
    fn fold_object_pat(&mut self, p: ObjectPat) -> ObjectPat {
        ObjectPat {
            optional: false,
            ..p.fold_children_with(self)
        }
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }

    fn fold_block_stmt_or_expr(&mut self, body: BlockStmtOrExpr) -> BlockStmtOrExpr {
        let span = body.span();

        match body {
            BlockStmtOrExpr::Expr(expr) if expr.is_class() => {
                let ClassExpr { ident, class } = expr.class().unwrap();

                let mut stmts = vec![];
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (vars, decl, mut extra_stmts) = self.fold_class_as_decl(ident.clone(), class);
                if !vars.is_empty() {
                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vars,
                        declare: false,
                    })));
                }
                stmts.push(Stmt::Decl(decl));
                stmts.append(&mut extra_stmts);
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(Expr::Ident(ident))),
                }));

                BlockStmtOrExpr::BlockStmt(BlockStmt { span, stmts })
            }
            _ => body.fold_children_with(self),
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            // TODO(kdy1): Make it generate smaller code.
            //
            // We currently creates a iife for a class expression.
            // Although this results in a large code, but it's ok as class expression is rarely used
            // in wild.
            Expr::Class(ClassExpr { ident, class }) => {
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let mut stmts = vec![];
                let (vars, decl, mut extra_stmts) = self.fold_class_as_decl(ident.clone(), class);

                if !vars.is_empty() {
                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vars,
                        declare: false,
                    })));
                }
                stmts.push(Stmt::Decl(decl));
                stmts.append(&mut extra_stmts);

                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(Expr::Ident(ident))),
                }));

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: FnExpr {
                        ident: None,
                        function: Function {
                            span: DUMMY_SP,
                            decorators: vec![],
                            is_async: false,
                            is_generator: false,
                            params: vec![],

                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                stmts,
                            }),

                            type_params: Default::default(),
                            return_type: Default::default(),
                        },
                    }
                    .as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                })
            }
            _ => expr,
        }
    }
}

impl ClassProperties {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + ModuleItemLike + FoldWith<Self>,
    {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match T::try_into_stmt(stmt) {
                Err(node) => match node.try_into_module_decl() {
                    Ok(decl) => {
                        let decl = decl.fold_children_with(self);

                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                                span,
                                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                                ..
                            }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_class"));

                                let (vars, decl, stmts) =
                                    self.fold_class_as_decl(ident.clone(), class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(T::from_stmt(Stmt::Decl(decl)));
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                        NamedExport {
                                            span,
                                            specifiers: vec![ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: ident,
                                                exported: Some(private_ident!("default")),
                                            }
                                            .into()],
                                            src: None,
                                            type_only: false,
                                            asserts: None,
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl:
                                    Decl::Class(ClassDecl {
                                        ident,
                                        declare: false,
                                        class,
                                    }),
                                ..
                            }) => {
                                let (vars, decl, stmts) = self.fold_class_as_decl(ident, class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportDecl(
                                        ExportDecl { span, decl },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                            }
                            _ => buf.push(match T::try_from_module_decl(decl) {
                                Ok(t) => t,
                                Err(..) => unreachable!(),
                            }),
                        };
                    }
                    Err(..) => unreachable!(),
                },
                Ok(stmt) => {
                    let stmt = stmt.fold_children_with(self);
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let (vars, decl, stmts) = self.fold_class_as_decl(ident, class);
                            if !vars.is_empty() {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: vars,
                                    declare: false,
                                }))));
                            }
                            buf.push(T::from_stmt(Stmt::Decl(decl)));
                            buf.extend(stmts.into_iter().map(T::from_stmt));
                        }
                        _ => buf.push(T::from_stmt(stmt)),
                    }
                }
            }
        }

        buf
    }
}

impl ClassProperties {
    fn fold_class_as_decl(
        &mut self,
        ident: Ident,
        class: Class,
    ) -> (Vec<VarDeclarator>, Decl, Vec<Stmt>) {
        // Create one mark per class
        self.mark = Mark::fresh(Mark::root());

        let has_super = class.super_class.is_some();

        let mut typescript_constructor_properties = vec![];

        let (mut constructor_exprs, mut vars, mut extra_stmts, mut members, mut constructor) =
            (vec![], vec![], vec![], vec![], None);
        let mut used_names = vec![];
        let mut used_key_names = vec![];
        let mut statics = HashSet::default();

        for member in class.body {
            match member {
                ClassMember::PrivateMethod(..)
                | ClassMember::Empty(..)
                | ClassMember::TsIndexSignature(..) => members.push(member),

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = match method.key {
                        PropName::Computed(ComputedPropName { span: c_span, expr }) => {
                            let expr =
                                expr.fold_with(&mut ClassNameTdzFolder { class_name: &ident });
                            let ident = private_ident!("tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone().into()),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(ComputedPropName {
                                span: c_span,
                                expr: Box::new(Expr::Ident(ident)),
                            })
                        }
                        _ => method.key,
                    };
                    members.push(ClassMember::Method(ClassMethod { key, ..method }))
                }

                ClassMember::ClassProp(mut prop) => {
                    let prop_span = prop.span();
                    prop.key = prop
                        .key
                        .fold_with(&mut ClassNameTdzFolder { class_name: &ident });

                    if !prop.is_static {
                        prop.key.visit_with(
                            &Invalid { span: DUMMY_SP } as _,
                            &mut UsedNameCollector {
                                used_names: &mut used_key_names,
                            },
                        );

                        prop.value.visit_with(
                            &Invalid { span: DUMMY_SP } as _,
                            &mut UsedNameCollector {
                                used_names: &mut used_names,
                            },
                        );
                    }

                    let key = if self.typescript {
                        // `b` in
                        //
                        // class A {
                        //     b = 'foo';
                        // }
                        prop.key
                    } else {
                        match *prop.key {
                            Expr::Ident(ref i) if !prop.computed => {
                                Box::new(Expr::from(Lit::Str(Str {
                                    span: i.span,
                                    value: i.sym.clone(),
                                    has_escape: false,
                                    kind: StrKind::Normal {
                                        contains_quote: false,
                                    },
                                })))
                            }
                            Expr::Lit(ref lit) if !prop.computed => {
                                Box::new(Expr::from(lit.clone()))
                            }

                            _ => {
                                let (ident, aliased) = if let Expr::Ident(ref i) = *prop.key {
                                    if used_key_names.contains(&i.sym) {
                                        (alias_ident_for(&prop.key, "_ref"), true)
                                    } else {
                                        alias_if_required(&prop.key, "_ref")
                                    }
                                } else {
                                    alias_if_required(&prop.key, "_ref")
                                };
                                // ident.span = ident.span.apply_mark(Mark::fresh(Mark::root()));
                                if aliased {
                                    // Handle computed property
                                    vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(ident.clone().into()),
                                        init: Some(prop.key),
                                        definite: false,
                                    });
                                }
                                Box::new(Expr::from(ident))
                            }
                        }
                    };

                    let assigned_value = prop.value.is_some();

                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));
                    let value = if prop.is_static {
                        value
                            .fold_with(&mut SuperFieldAccessFolder {
                                class_name: &ident,
                                vars: &mut vars,
                                constructor_this_mark: None,
                                is_static: true,
                                folding_constructor: false,
                                in_injected_define_property_call: false,
                                in_nested_scope: false,
                                this_alias_mark: None,
                            })
                            .fold_with(&mut ThisInStaticFolder {
                                ident: ident.clone(),
                            })
                    } else {
                        value
                    };

                    if self.typescript {
                        if prop.is_static {
                            extra_stmts.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(
                                        MemberExpr {
                                            span: DUMMY_SP,
                                            obj: ident.clone().as_obj(),
                                            computed: prop.computed,
                                            prop: key,
                                        }
                                        .into(),
                                    )),
                                    op: op!("="),
                                    right: value,
                                }
                                .into_stmt(),
                            );
                        } else if assigned_value {
                            constructor_exprs.push(Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: (PatOrExpr::Expr(Box::new(
                                    MemberExpr {
                                        span: DUMMY_SP,
                                        obj: ThisExpr { span: DUMMY_SP }.as_obj(),
                                        computed: prop.computed,
                                        prop: key,
                                    }
                                    .into(),
                                ))),
                                op: op!("="),
                                right: value,
                            })));
                        }
                    } else {
                        let callee = helper!(define_property, "defineProperty");

                        if prop.is_static {
                            extra_stmts.push(
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee,
                                    args: vec![
                                        ident.clone().as_arg(),
                                        key.as_arg(),
                                        value.as_arg(),
                                    ],
                                    type_args: Default::default(),
                                }
                                .into_stmt(),
                            )
                        } else {
                            constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee,
                                args: vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    key.as_arg(),
                                    value.as_arg(),
                                ],
                                type_args: Default::default(),
                            })));
                        }
                    }
                }
                ClassMember::PrivateProp(prop) => {
                    let prop_span = prop.span();
                    if prop.is_static {
                        statics.insert(prop.key.id.sym.clone());
                    }

                    let ident = Ident::new(
                        format!("_{}", prop.key.id.sym).into(),
                        // We use `self.mark` for private variables.
                        prop.key.span.apply_mark(self.mark),
                    );
                    prop.value.visit_with(
                        &Invalid { span: DUMMY_SP } as _,
                        &mut UsedNameCollector {
                            used_names: &mut used_names,
                        },
                    );
                    let value = prop.value.unwrap_or_else(|| undefined(prop_span));

                    let extra_init = if prop.is_static {
                        Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("writable")),
                                    value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    }))),
                                }))),
                                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("value")),
                                    value,
                                }))),
                            ],
                        }))
                    } else {
                        constructor_exprs.push(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: ident.clone().make_member(quote_ident!("set")).as_callee(),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                ObjectLit {
                                    span: DUMMY_SP,
                                    props: vec![
                                        // writeable: true
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                                    value: true,
                                                    span: DUMMY_SP,
                                                }))),
                                            },
                                        ))),
                                        // value: value,
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("value")),
                                                value,
                                            },
                                        ))),
                                    ],
                                }
                                .as_arg(),
                            ],
                            type_args: Default::default(),
                        })));

                        Box::new(Expr::New(NewExpr {
                            span: DUMMY_SP,
                            callee: Box::new(Expr::Ident(quote_ident!("WeakMap"))),
                            args: Some(vec![]),
                            type_args: Default::default(),
                        }))
                    };

                    extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: Pat::Ident(ident.clone().into()),
                            init: Some(extra_init),
                        }],
                    })));
                }

                ClassMember::Constructor(mut c) => {
                    if self.typescript {
                        let store = |i: &Ident| {
                            Box::new(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: ThisExpr { span: DUMMY_SP }.as_obj(),
                                        computed: false,
                                        prop: Box::new(i.clone().into()),
                                    }))),
                                    op: op!("="),
                                    right: Box::new(i.clone().into()),
                                }
                                .into(),
                            )
                        };

                        c.params = c.params.move_map(|mut param| match &mut param {
                            ParamOrTsParamProp::TsParamProp(p) => match &p.param {
                                TsParamPropParam::Ident(i) => {
                                    typescript_constructor_properties.push(store(&i.id));
                                    ParamOrTsParamProp::Param(Param {
                                        span: p.span,
                                        decorators: take(&mut p.decorators),
                                        pat: Pat::Ident(i.clone().into()),
                                    })
                                }
                                TsParamPropParam::Assign(pat) => match &*pat.left {
                                    Pat::Ident(i) => {
                                        typescript_constructor_properties.push(store(&i.id));
                                        ParamOrTsParamProp::Param(Param {
                                            span: p.span,
                                            decorators: take(&mut p.decorators),
                                            pat: Pat::Assign(AssignPat {
                                                span: DUMMY_SP,
                                                left: pat.left.clone(),
                                                right: pat.right.clone(),
                                                type_ann: None,
                                            }),
                                        })
                                    }
                                    _ => param,
                                },
                            },
                            ParamOrTsParamProp::Param(_) => param,
                        });
                    }

                    constructor = Some(c);
                }
            }
        }

        let constructor_exprs = {
            typescript_constructor_properties.extend(constructor_exprs);
            typescript_constructor_properties
        };

        let constructor =
            self.process_constructor(constructor, has_super, &used_names, constructor_exprs);
        if let Some(c) = constructor {
            members.push(ClassMember::Constructor(c));
        }

        let members = members.fold_with(&mut FieldAccessFolder {
            mark: self.mark,
            statics: &statics,
            vars: vec![],
            class_name: &ident,
            in_assign_pat: false,
        });

        (
            vars,
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            }),
            extra_stmts,
        )
    }

    /// # Legacy support.
    ///
    /// ## Why is this required?
    ///
    /// Hygiene data of
    ///
    ///```ts
    /// class A {
    ///     b = this.a;
    ///     constructor(a){
    ///         this.a = a;
    ///     }
    /// }
    /// ```
    ///
    /// is
    ///
    ///```ts
    /// class A0 {
    ///     constructor(a1){
    ///         this.a0 = a0;
    ///         this.b0 = this.a0;
    ///     }
    /// }
    /// ```
    ///
    /// which is valid only for es2020 properties.
    ///
    /// Legacy proposal which is used by typescript requires different hygiene.
    #[allow(clippy::vec_box)]
    fn process_constructor(
        &mut self,
        constructor: Option<Constructor>,
        has_super: bool,
        used_names: &[JsWord],
        constructor_exprs: Vec<Box<Expr>>,
    ) -> Option<Constructor> {
        let constructor = constructor
            .map(|c| {
                if self.typescript {
                    c
                } else {
                    let mut folder = UsedNameRenamer {
                        mark: Mark::fresh(Mark::root()),
                        used_names,
                    };

                    // Handle collisions like
                    //
                    // var foo = "bar";
                    //
                    // class Foo {
                    //     bar = foo;
                    //     static bar = baz;
                    //
                    //     constructor() {
                    //     var foo = "foo";
                    //     var baz = "baz";
                    //     }
                    // }
                    let body = c.body.fold_with(&mut folder);

                    let params = c.params.fold_with(&mut folder);
                    Constructor { body, params, ..c }
                }
            })
            .or_else(|| {
                if constructor_exprs.is_empty() {
                    None
                } else {
                    Some(default_constructor(has_super))
                }
            });

        if let Some(mut c) = constructor {
            // Prepend properties
            inject_after_super(&mut c, constructor_exprs);
            Some(c)
        } else {
            None
        }
    }
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_ident(&mut self, n: &Ident, _: &dyn Node) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_array_pat(&mut self, n: &ArrayPat, _: &dyn Node) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_object_pat(&mut self, n: &ObjectPat, _: &dyn Node) {
        if n.optional {
            self.found = true;
        }
    }

    fn visit_class_method(&mut self, _: &ClassMethod, _: &dyn Node) {
        self.found = true;
    }

    fn visit_class_prop(&mut self, _: &ClassProp, _: &dyn Node) {
        self.found = true;
    }

    fn visit_private_prop(&mut self, _: &PrivateProp, _: &dyn Node) {
        self.found = true;
    }

    fn visit_constructor(&mut self, _: &Constructor, _: &dyn Node) {
        self.found = true;
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
