use crate::util::{prepend_stmts, var::VarCollector, ExprFactory};
use fxhash::FxHashMap;
use swc_atoms::js_word;
use swc_common::{util::move_map::MoveMap, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{Fold, FoldWith, Node, Visit, VisitWith};

/// Value does not contain TsLit::Bool
type EnumValues = FxHashMap<Id, TsLit>;

/// Strips type annotations out.
pub fn strip() -> impl Fold {
    Strip::default()
}

#[derive(Default)]
struct Strip {
    non_top_level: bool,
    scope: Scope,
    phase: Phase,

    was_side_effect_import: bool,
}

#[derive(Debug, Clone, Copy)]
enum Phase {
    ///
    ///  - analyze ident usages
    ///  - remove type annotations
    Analysis,
    ///
    ///  - remove type-only imports
    DropImports,
}
impl Default for Phase {
    fn default() -> Self {
        Phase::Analysis
    }
}

#[derive(Default)]
struct Scope {
    decls: FxHashMap<Id, DeclInfo>,
    imported_idents: FxHashMap<Id, DeclInfo>,
}

#[derive(Debug, Default)]
struct DeclInfo {
    /// interface / type alias
    has_type: bool,
    /// Var, Fn, Class
    has_concrete: bool,
}

impl Strip {
    fn handle_decl(&mut self, decl: &Decl) {
        // We don't care about stuffs which cannot be exported
        if self.non_top_level {
            return;
        }

        macro_rules! store {
            ($sym:expr, $ctxt:expr, $concrete:expr) => {{
                let entry = self.scope.decls.entry(($sym.clone(), $ctxt)).or_default();

                if $concrete {
                    entry.has_concrete = true
                } else {
                    entry.has_type = true;
                }
            }};
        }
        match *decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => {
                store!(ident.sym, ident.span.ctxt(), true);
            }

            Decl::Var(ref var) => {
                let mut names = vec![];
                var.decls.visit_with(
                    &Invalid { span: DUMMY_SP } as _,
                    &mut VarCollector { to: &mut names },
                );

                for name in names {
                    store!(name.0, name.1, true);
                }
            }

            Decl::TsEnum(TsEnumDecl { ref id, .. }) => {
                // Currently swc cannot remove constant enums
                store!(id.sym, id.span.ctxt(), true);
                store!(id.sym, id.span.ctxt(), false);
            }

            Decl::TsInterface(TsInterfaceDecl { ref id, .. })
            | Decl::TsModule(TsModuleDecl {
                id: TsModuleName::Ident(ref id),
                ..
            })
            | Decl::TsTypeAlias(TsTypeAliasDecl { ref id, .. }) => {
                store!(id.sym, id.span.ctxt(), false)
            }

            Decl::TsModule(TsModuleDecl {
                id:
                    TsModuleName::Str(Str {
                        ref value, span, ..
                    }),
                ..
            }) => store!(value, span.ctxt(), false),
        }
    }
}

impl Strip {
    fn add_types<T>(&mut self, node: T) -> T
    where
        T: VisitWith<Self>,
    {
        match self.phase {
            Phase::Analysis => {
                node.visit_with(&Invalid { span: DUMMY_SP } as _, self);
            }
            Phase::DropImports => {}
        }

        node
    }

    fn handle_enum<T>(&mut self, e: TsEnumDecl, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        /// Called only for enums.
        ///
        /// If both of the default value and the initialization is None, this
        /// method returns [Err].
        fn compute(
            e: &TsEnumDecl,
            span: Span,
            values: &mut EnumValues,
            default: Option<i32>,
            init: Option<&Expr>,
        ) -> Result<TsLit, ()> {
            fn compute_bin(
                e: &TsEnumDecl,
                span: Span,
                values: &mut EnumValues,
                expr: &BinExpr,
            ) -> Result<TsLit, ()> {
                let l = compute(e, span, values, None, Some(&expr.left))?;
                let r = compute(e, span, values, None, Some(&expr.right))?;

                Ok(match (l, r) {
                    (
                        TsLit::Number(Number { value: l, .. }),
                        TsLit::Number(Number { value: r, .. }),
                    ) => {
                        TsLit::Number(Number {
                            span,
                            value: match expr.op {
                                op!(bin, "+") => l + r,
                                op!(bin, "-") => l - r,
                                op!("*") => l * r,
                                op!("/") => l / r,

                                // TODO
                                op!("&") => ((l.round() as i64) & (r.round() as i64)) as _,
                                op!("|") => ((l.round() as i64) | (r.round() as i64)) as _,
                                op!("^") => ((l.round() as i64) ^ (r.round() as i64)) as _,

                                op!("<<") => ((l.round() as i64) << (r.round() as i64)) as _,
                                op!(">>") => ((l.round() as i64) >> (r.round() as i64)) as _,
                                // TODO: Verify this
                                op!(">>>") => ((l.round() as u64) >> (r.round() as u64)) as _,
                                _ => Err(())?,
                            },
                        })
                    }
                    (TsLit::Str(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => TsLit::Str(Str {
                        span,
                        value: format!("{}{}", l.value, r.value).into(),
                        has_escape: l.has_escape || r.has_escape,
                    }),
                    (TsLit::Number(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => {
                        TsLit::Str(Str {
                            span,
                            value: format!("{}{}", l.value, r.value).into(),
                            has_escape: r.has_escape,
                        })
                    }
                    (TsLit::Str(l), TsLit::Number(r)) if expr.op == op!(bin, "+") => {
                        TsLit::Str(Str {
                            span,
                            value: format!("{}{}", l.value, r.value).into(),
                            has_escape: l.has_escape,
                        })
                    }
                    _ => Err(())?,
                })
            }

            if let Some(expr) = init {
                match expr {
                    Expr::Lit(Lit::Str(s)) => return Ok(TsLit::Str(s.clone())),
                    Expr::Lit(Lit::Num(s)) => return Ok(TsLit::Number(*s)),
                    Expr::Bin(ref bin) => return compute_bin(e, span, values, &bin),
                    Expr::Paren(ref paren) => {
                        return compute(e, span, values, default, Some(&paren.expr))
                    }

                    Expr::Ident(ref id) => {
                        if let Some(v) = values.get(&id.clone().into_id()) {
                            return Ok(v.clone());
                        }
                        //
                        for m in e.members.iter() {
                            match m.id {
                                TsEnumMemberId::Str(Str { value: ref sym, .. })
                                | TsEnumMemberId::Ident(Ident { ref sym, .. }) => {
                                    if *sym == id.sym {
                                        return compute(
                                            e,
                                            span,
                                            values,
                                            None,
                                            m.init.as_ref().map(|v| &**v),
                                        );
                                    }
                                }
                            }
                        }
                        return Err(());
                    }
                    Expr::Unary(ref expr) => {
                        let v = compute(e, span, values, None, Some(&expr.arg))?;
                        match v {
                            TsLit::Number(Number { value: v, .. }) => {
                                return Ok(TsLit::Number(Number {
                                    span,
                                    value: match expr.op {
                                        op!(unary, "+") => v,
                                        op!(unary, "-") => -v,
                                        op!("!") => {
                                            if v == 0.0f64 {
                                                0.0
                                            } else {
                                                1.0
                                            }
                                        }
                                        op!("~") => (!(v as i32)) as f64,
                                        _ => Err(())?,
                                    },
                                }))
                            }
                            TsLit::Str(_) => {}
                            TsLit::Bool(_) => {}
                            TsLit::Tpl(_) => {}
                        }
                    }

                    Expr::Tpl(ref t) if t.exprs.is_empty() => {
                        if let Some(v) = &t.quasis[0].cooked {
                            return Ok(v.clone().into());
                        }
                    }

                    _ => {}
                }
            } else {
                if let Some(value) = default {
                    return Ok(TsLit::Number(Number {
                        span,
                        value: value as _,
                    }));
                }
            }

            Err(())
        }

        let id = e.id.clone();

        let mut default = 0;
        let mut values = Default::default();
        let members = e
            .members
            .clone()
            .into_iter()
            .map(|m| -> Result<_, ()> {
                let id_span = m.id.span();
                let val = compute(
                    &e,
                    id_span,
                    &mut values,
                    Some(default),
                    m.init.as_ref().map(|v| &**v),
                )
                .map(|val| {
                    match val {
                        TsLit::Number(n) => {
                            default = n.value as i32 + 1;
                        }
                        _ => {}
                    }
                    values.insert(
                        match &m.id {
                            TsEnumMemberId::Ident(i) => i.clone().into_id(),
                            TsEnumMemberId::Str(s) => Ident::new(s.value.clone(), s.span).into_id(),
                        },
                        val.clone(),
                    );

                    match val {
                        TsLit::Number(v) => Expr::Lit(Lit::Num(v)),
                        TsLit::Str(v) => Expr::Lit(Lit::Str(v)),
                        TsLit::Bool(v) => Expr::Lit(Lit::Bool(v)),
                        TsLit::Tpl(v) => {
                            Expr::Lit(Lit::Str(v.quasis.into_iter().next().unwrap().raw))
                        }
                    }
                })
                .or_else(|err| match &m.init {
                    None => Err(err),
                    Some(v) => Ok(*v.clone()),
                })?;

                Ok((m, val))
            })
            .collect::<Result<Vec<_>, _>>()
            .unwrap_or_else(|_| panic!("invalid value for enum is detected"));

        let is_all_str = members.iter().all(|(_, v)| match v {
            Expr::Lit(Lit::Str(..)) => true,
            _ => false,
        });
        let no_init_required = is_all_str;
        let rhs_should_be_name = members.iter().all(|(m, v): &(TsEnumMember, Expr)| match v {
            Expr::Lit(Lit::Str(s)) => match &m.id {
                TsEnumMemberId::Ident(i) => i.sym == s.value,
                TsEnumMemberId::Str(s) => s.value != s.value,
            },
            _ => true,
        });

        stmts.push(T::from_stmt(
            CallExpr {
                span: DUMMY_SP,
                callee: FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        is_async: false,
                        is_generator: false,
                        type_params: Default::default(),
                        params: vec![Param {
                            span: id.span,
                            decorators: vec![],
                            pat: Pat::Ident(id.clone()),
                        }],
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: members
                                .into_iter()
                                .enumerate()
                                .map(|(_, (m, val))| {
                                    let value = match m.id {
                                        TsEnumMemberId::Str(s) => s,
                                        TsEnumMemberId::Ident(i) => Str {
                                            span: i.span,
                                            value: i.sym,
                                            has_escape: false,
                                        },
                                    };
                                    let prop = if no_init_required {
                                        Box::new(Expr::Lit(Lit::Str(value.clone())))
                                    } else {
                                        Box::new(Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(Expr::Member(
                                                MemberExpr {
                                                    span: DUMMY_SP,
                                                    obj: id.clone().as_obj(),
                                                    prop: Box::new(Expr::Lit(Lit::Str(
                                                        value.clone(),
                                                    ))),
                                                    computed: true,
                                                },
                                            ))),
                                            op: op!("="),
                                            right: Box::new(val),
                                        }))
                                    };

                                    // Foo[Foo["a"] = 0] = "a";
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                            obj: id.clone().as_obj(),
                                            span: DUMMY_SP,
                                            computed: true,

                                            // Foo["a"] = 0
                                            prop,
                                        }))),
                                        op: op!("="),
                                        right: if rhs_should_be_name {
                                            Box::new(Expr::Lit(Lit::Str(value.clone())))
                                        } else {
                                            m.init.unwrap_or_else(|| {
                                                Box::new(Expr::Lit(Lit::Str(value.clone())))
                                            })
                                        },
                                    }
                                    .into_stmt()
                                })
                                .collect(),
                        }),
                        return_type: Default::default(),
                    },
                }
                .as_callee(),
                args: vec![BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(Expr::Ident(id.clone())),
                    op: op!("||"),
                    right: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Pat::Ident(id.clone()).into()),
                        op: op!("="),
                        right: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        })),
                    })),
                }
                .as_arg()],
                type_args: Default::default(),
            }
            .into_stmt(),
        ))
    }
}

impl Visit for Strip {
    fn visit_ts_entity_name(&mut self, name: &TsEntityName, _: &dyn Node) {
        assert!(match self.phase {
            Phase::Analysis => true,
            _ => false,
        });

        match *name {
            TsEntityName::Ident(ref i) => {
                self.scope
                    .imported_idents
                    .entry((i.sym.clone(), i.span.ctxt()))
                    .and_modify(|v| v.has_type = true);
            }
            TsEntityName::TsQualifiedName(..) => name.visit_children_with(self),
        }
    }
}

macro_rules! type_to_none {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: Option<$T>) -> Option<$T> {
            node.visit_with(&Invalid { span: DUMMY_SP } as _, self);

            None
        }
    };
}

impl Fold for Strip {
    fn fold_class(&mut self, node: Class) -> Class {
        Class {
            span: node.span,
            is_abstract: false,
            type_params: {
                self.add_types(node.type_params);
                None
            },
            super_type_params: {
                self.add_types(node.super_type_params);
                None
            },
            implements: {
                self.add_types(node.implements);
                vec![]
            },

            decorators: node.decorators.fold_with(self),
            body: node.body.fold_with(self),
            super_class: node.super_class.fold_with(self),
        }
    }

    fn fold_constructor(&mut self, c: Constructor) -> Constructor {
        let c = c.fold_children_with(self);

        let mut stmts = vec![];

        let params = c.params.move_map(|param| match param {
            ParamOrTsParamProp::Param(..) => param,
            ParamOrTsParamProp::TsParamProp(param) => {
                let (ident, param) = match param.param {
                    TsParamPropParam::Ident(i) => (
                        i.clone(),
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(i),
                        },
                    ),
                    TsParamPropParam::Assign(AssignPat {
                        span, left, right, ..
                    }) if left.is_ident() => {
                        let i = left.ident().unwrap();

                        (
                            i.clone(),
                            Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat: Pat::Assign(AssignPat {
                                    span,
                                    left: Box::new(Pat::Ident(i)),
                                    right,
                                    type_ann: None,
                                }),
                            },
                        )
                    }
                    _ => unreachable!("destructuring pattern inside TsParameterProperty"),
                };
                stmts.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Expr(Box::new(
                            ThisExpr { span: DUMMY_SP }.make_member(ident.clone()),
                        )),
                        op: op!("="),
                        right: Box::new(Expr::Ident(ident)),
                    }
                    .into_stmt(),
                );

                ParamOrTsParamProp::Param(param)
            }
        });

        let body = match c.body {
            Some(mut body) => {
                prepend_stmts(&mut body.stmts, stmts.into_iter());
                Some(body)
            }
            None => None,
        };

        Constructor { params, body, ..c }
    }

    fn fold_decl(&mut self, decl: Decl) -> Decl {
        let decl = validate!(decl);
        self.handle_decl(&decl);

        let old = self.non_top_level;
        self.non_top_level = true;
        let decl = decl.fold_children_with(self);
        self.non_top_level = old;
        validate!(decl)
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            Expr::TsAs(TsAsExpr { expr, type_ann, .. }) => {
                type_ann.visit_with(&Invalid { span: DUMMY_SP } as _, self);
                validate!(*expr)
            }
            Expr::TsNonNull(TsNonNullExpr { expr, .. }) => validate!(*expr),
            Expr::TsTypeAssertion(TsTypeAssertion { expr, type_ann, .. }) => {
                type_ann.visit_with(&Invalid { span: DUMMY_SP } as _, self);
                validate!(*expr)
            }
            Expr::TsConstAssertion(TsConstAssertion { expr, .. }) => validate!(*expr),
            Expr::TsTypeCast(TsTypeCastExpr { expr, type_ann, .. }) => {
                type_ann.visit_with(&Invalid { span: DUMMY_SP } as _, self);
                validate!(*expr)
            }
            _ => validate!(expr),
        };

        let expr = match expr {
            Expr::Member(MemberExpr {
                span,
                obj,
                prop,
                computed,
            }) => Expr::Member(MemberExpr {
                span,
                obj: obj.fold_with(self),
                prop: if computed { prop.fold_with(self) } else { prop },
                computed,
            }),
            _ => expr.fold_children_with(self),
        };

        expr
    }

    fn fold_ident(&mut self, i: Ident) -> Ident {
        self.scope
            .imported_idents
            .entry((i.sym.clone(), i.span.ctxt()))
            .and_modify(|v| v.has_concrete = true);

        Ident {
            optional: false,
            ..i.fold_children_with(self)
        }
    }

    fn fold_import_decl(&mut self, mut import: ImportDecl) -> ImportDecl {
        match self.phase {
            Phase::Analysis => {
                macro_rules! store {
                    ($i:expr) => {{
                        self.scope
                            .imported_idents
                            .insert(($i.sym.clone(), $i.span.ctxt()), Default::default());
                    }};
                }
                for s in &import.specifiers {
                    match *s {
                        ImportSpecifier::Default(ref import) => store!(import.local),
                        ImportSpecifier::Named(ref import) => store!(import.local),
                        ImportSpecifier::Namespace(..) => {}
                    }
                }

                import
            }
            Phase::DropImports => {
                self.was_side_effect_import = import.specifiers.is_empty();

                import.specifiers.retain(|s| match *s {
                    ImportSpecifier::Default(ImportDefaultSpecifier { ref local, .. })
                    | ImportSpecifier::Named(ImportNamedSpecifier { ref local, .. }) => {
                        let entry = self
                            .scope
                            .imported_idents
                            .get(&(local.sym.clone(), local.span.ctxt()));
                        match entry {
                            Some(&DeclInfo {
                                has_type: true,
                                has_concrete: false,
                            }) => false,
                            _ => true,
                        }
                    }
                    _ => true,
                });

                import
            }
        }
    }

    fn fold_private_prop(&mut self, mut prop: PrivateProp) -> PrivateProp {
        prop = prop.fold_children_with(self);
        prop.readonly = false;
        prop
    }

    fn fold_class_prop(&mut self, mut prop: ClassProp) -> ClassProp {
        prop = prop.fold_children_with(self);
        prop.readonly = false;
        prop
    }

    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children_with(self);

        match stmt {
            Stmt::Decl(decl) => match decl {
                Decl::TsInterface(..)
                | Decl::TsModule(..)
                | Decl::TsTypeAlias(..)
                | Decl::Var(VarDecl { declare: true, .. })
                | Decl::Class(ClassDecl { declare: true, .. })
                | Decl::Fn(FnDecl { declare: true, .. }) => {
                    let span = decl.span();
                    Stmt::Empty(EmptyStmt { span })
                }

                _ => Stmt::Decl(decl),
            },
            _ => stmt,
        }
    }

    fn fold_stmts(&mut self, mut orig: Vec<Stmt>) -> Vec<Stmt> {
        let old = self.phase;

        // First pass
        self.phase = Phase::Analysis;
        orig = orig.fold_children_with(self);
        self.phase = Phase::DropImports;

        // Second pass
        let mut stmts = Vec::with_capacity(orig.len());
        for item in orig {
            self.was_side_effect_import = false;
            match item {
                Stmt::Empty(..) => continue,

                Stmt::Decl(Decl::TsEnum(e)) => {
                    // var Foo;
                    // (function (Foo) {
                    //     Foo[Foo["a"] = 0] = "a";
                    // })(Foo || (Foo = {}));

                    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: e.span,
                            name: Pat::Ident(e.id.clone()),
                            definite: false,
                            init: None,
                        }],
                    })));
                    self.handle_enum(e, &mut stmts)
                }

                // Strip out ts-only extensions
                Stmt::Decl(Decl::Fn(FnDecl {
                    function: Function { body: None, .. },
                    ..
                }))
                | Stmt::Decl(Decl::TsInterface(..))
                | Stmt::Decl(Decl::TsModule(..))
                | Stmt::Decl(Decl::TsTypeAlias(..)) => continue,

                _ => stmts.push(item.fold_with(self)),
            };
        }
        self.phase = old;

        stmts
    }

    fn fold_ts_interface_decl(&mut self, node: TsInterfaceDecl) -> TsInterfaceDecl {
        TsInterfaceDecl {
            span: node.span,
            id: node.id,
            type_params: None,
            extends: self.add_types(node.extends),
            body: self.add_types(node.body),
            declare: false,
        }
    }

    fn fold_ts_type_alias_decl(&mut self, node: TsTypeAliasDecl) -> TsTypeAliasDecl {
        self.add_types(node)
    }

    type_to_none!(fold_opt_ts_type, Box<TsType>);
    type_to_none!(fold_opt_ts_type_ann, TsTypeAnn);
    type_to_none!(fold_opt_ts_type_param_decl, TsTypeParamDecl);
    type_to_none!(
        fold_opt_ts_type_param_instantiation,
        TsTypeParamInstantiation
    );

    fn fold_class_members(&mut self, members: Vec<ClassMember>) -> Vec<ClassMember> {
        let members = members.fold_children_with(self);

        members.move_flat_map(|member| match member {
            ClassMember::TsIndexSignature(..) => None,
            ClassMember::Constructor(Constructor { body: None, .. }) => None,
            ClassMember::Method(ClassMethod {
                is_abstract: true, ..
            })
            | ClassMember::Method(ClassMethod {
                function: Function { body: None, .. },
                ..
            }) => None,
            ClassMember::ClassProp(ClassProp {
                value: None,
                ref decorators,
                ..
            }) if decorators.is_empty() => None,

            _ => Some(member),
        })
    }

    fn fold_opt_accessibility(&mut self, _: Option<Accessibility>) -> Option<Accessibility> {
        None
    }

    /// Remove `this` from parameter list
    fn fold_params(&mut self, params: Vec<Param>) -> Vec<Param> {
        let mut params = params.fold_children_with(self);

        params.retain(|param| match param.pat {
            Pat::Ident(Ident {
                sym: js_word!("this"),
                ..
            }) => false,
            _ => true,
        });

        params
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let old = self.phase;

        // First pass
        self.phase = Phase::Analysis;
        let items = items.fold_children_with(self);

        self.phase = Phase::DropImports;

        // Second pass
        let mut stmts = Vec::with_capacity(items.len());
        for item in items {
            self.was_side_effect_import = false;
            match item {
                ModuleItem::Stmt(Stmt::Empty(..))
                | ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    type_only: true, ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    type_only: true,
                    ..
                })) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                    let i = i.fold_with(self);

                    if self.was_side_effect_import || !i.specifiers.is_empty() {
                        stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(i)));
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsEnum(e),
                    ..
                })) => {
                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: e.span,
                        decl: Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: e.span,
                                name: Pat::Ident(e.id.clone()),
                                definite: false,
                                init: None,
                            }],
                        }),
                    })));
                    self.handle_enum(e, &mut stmts)
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(e))) => {
                    // var Foo;
                    // (function (Foo) {
                    //     Foo[Foo["a"] = 0] = "a";
                    // })(Foo || (Foo = {}));

                    stmts.push(
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: e.span,
                                name: Pat::Ident(e.id.clone()),
                                definite: false,
                                init: None,
                            }],
                        }))
                        .into(),
                    );
                    self.handle_enum(e, &mut stmts)
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    ref expr,
                    ..
                })) if expr.is_ident() => {
                    let i = expr.clone().ident().unwrap();
                    // type MyType = string;
                    // export default MyType;

                    let preserve = if let Some(decl_info) = self.scope.decls.get(&i.to_id()) {
                        decl_info.has_concrete
                    } else {
                        true
                    };

                    if preserve {
                        stmts.push(item)
                    }
                }

                // Strip out ts-only extensions
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                    function: Function { body: None, .. },
                    ..
                })))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(..)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsInterface(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsModule(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsTypeAlias(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Fn(FnDecl {
                            function: Function { body: None, .. },
                            ..
                        }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            function: Function { body: None, .. },
                            ..
                        }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl: DefaultDecl::TsInterfaceDecl(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => {
                    if !import.is_export {
                        continue;
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: DUMMY_SP,
                        decl: Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(import.id),
                                init: Some(Box::new(module_ref_to_expr(import.module_ref))),
                                definite: false,
                            }],
                            declare: false,
                        }),
                    })));
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => {
                    stmts.push(ModuleItem::ModuleDecl(
                        ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                            span: export.span(),
                            expr: export.expr,
                        })
                        .fold_with(self),
                    ))
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // if specifier become empty, we remove export statement.

                    export.specifiers.retain(|s| match *s {
                        ExportSpecifier::Named(ExportNamedSpecifier { ref orig, .. }) => {
                            if let Some(e) =
                                self.scope.decls.get(&(orig.sym.clone(), orig.span.ctxt()))
                            {
                                e.has_concrete
                            } else {
                                true
                            }
                        }
                        _ => true,
                    });
                    if export.specifiers.is_empty() {
                        continue;
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport { ..export },
                    )))
                }

                _ => stmts.push(item.fold_with(self)),
            };
        }
        self.phase = old;

        stmts
    }
}

fn module_ref_to_expr(r: TsModuleRef) -> Expr {
    match r {
        TsModuleRef::TsEntityName(name) => ts_entity_name_to_expr(name),
        _ => unimplemented!("export import A = B where B != TsEntityName\nB: {:?}", r),
    }
}

fn ts_entity_name_to_expr(n: TsEntityName) -> Expr {
    match n {
        TsEntityName::Ident(i) => i.into(),
        TsEntityName::TsQualifiedName(q) => {
            let TsQualifiedName { left, right } = *q;

            MemberExpr {
                span: DUMMY_SP,
                obj: ExprOrSuper::Expr(Box::new(ts_entity_name_to_expr(left))),
                prop: Box::new(right.into()),
                computed: false,
            }
            .into()
        }
    }
}
