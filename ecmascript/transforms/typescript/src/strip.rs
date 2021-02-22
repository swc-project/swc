use fxhash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::mem::take;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::move_map::MoveMap, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::var::VarCollector;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{as_folder, Fold, Node, Visit, VisitMut, VisitMutWith, VisitWith};

/// Value does not contain TsLit::Bool
type EnumValues = FxHashMap<Id, TsLit>;

#[derive(Debug, Serialize, Deserialize)]
#[non_exhaustive]
// TODO(nayeemrmn): The name should be `ImportsNotUsedAsValues`. Rename as a
// breaking change.
pub enum ImportNotUsedAsValues {
    #[serde(rename = "remove")]
    Remove,
    #[serde(rename = "preserve")]
    Preserve,
}

/// This value defaults to `Remove`
impl Default for ImportNotUsedAsValues {
    fn default() -> Self {
        Self::Remove
    }
}

#[derive(Debug, Default, Serialize, Deserialize)]
#[non_exhaustive]
pub struct Config {
    pub import_not_used_as_values: ImportNotUsedAsValues,
}

pub fn strip_with_config(config: Config) -> impl Fold {
    as_folder(Strip {
        config,
        ..Default::default()
    })
}

/// Strips type annotations out.
pub fn strip() -> impl Fold {
    strip_with_config(Default::default())
}

#[derive(Default)]
struct Strip {
    config: Config,
    non_top_level: bool,
    scope: Scope,
    is_side_effect_import: bool,
    is_type_only_export: bool,
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
    fn store(&mut self, sym: JsWord, ctxt: SyntaxContext, concrete: bool) {
        let entry = self.scope.decls.entry((sym, ctxt)).or_default();

        if concrete {
            entry.has_concrete = true
        } else {
            entry.has_type = true;
        }
    }

    fn handle_decl(&mut self, decl: &Decl) {
        // We don't care about stuffs which cannot be exported
        if self.non_top_level {
            return;
        }

        match *decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => {
                self.store(ident.sym.clone(), ident.span.ctxt, true);
            }

            Decl::Var(ref var) => {
                let mut names = vec![];
                var.decls.visit_with(
                    &Invalid { span: DUMMY_SP } as _,
                    &mut VarCollector { to: &mut names },
                );

                for name in names {
                    self.store(name.0.clone(), name.1, true);
                }
            }

            Decl::TsEnum(TsEnumDecl { ref id, .. }) => {
                // Currently swc cannot remove constant enums
                self.store(id.sym.clone(), id.span.ctxt, true);
                self.store(id.sym.clone(), id.span.ctxt, false);
            }

            Decl::TsInterface(TsInterfaceDecl { ref id, .. })
            | Decl::TsModule(TsModuleDecl {
                id: TsModuleName::Ident(ref id),
                ..
            })
            | Decl::TsTypeAlias(TsTypeAliasDecl { ref id, .. }) => {
                self.store(id.sym.clone(), id.span.ctxt, false)
            }

            Decl::TsModule(TsModuleDecl {
                id:
                    TsModuleName::Str(Str {
                        ref value, span, ..
                    }),
                ..
            }) => self.store(value.clone(), span.ctxt, false),
        }
    }
}

impl Strip {
    /// Returns [Some] if the method should be called again.
    fn handle_expr<'a>(&mut self, n: &'a mut Expr) -> Vec<&'a mut Expr> {
        match n {
            Expr::Bin(BinExpr { left, right, .. }) => return vec![&mut **left, &mut **right],

            // Remove types
            Expr::TsAs(TsAsExpr { expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr, .. }) => {
                expr.visit_mut_with(self);
                let expr = *expr.take();
                *n = expr;
            }

            Expr::Member(MemberExpr {
                obj,
                prop,
                computed,
                ..
            }) => {
                obj.visit_mut_with(self);

                if *computed {
                    prop.visit_mut_with(self);
                } else {
                    match &mut **prop {
                        Expr::Ident(i) => {
                            i.optional = false;
                        }
                        _ => {}
                    }
                }
            }

            _ => {
                n.visit_mut_children_with(self);
            }
        }

        vec![]
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
                        kind: Default::default(),
                    }),
                    (TsLit::Number(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => {
                        TsLit::Str(Str {
                            span,
                            value: format!("{}{}", l.value, r.value).into(),
                            has_escape: r.has_escape,
                            kind: Default::default(),
                        })
                    }
                    (TsLit::Str(l), TsLit::Number(r)) if expr.op == op!(bin, "+") => {
                        TsLit::Str(Str {
                            span,
                            value: format!("{}{}", l.value, r.value).into(),
                            has_escape: l.has_escape,
                            kind: Default::default(),
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
                            TsLit::BigInt(BigInt { .. }) => {}
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
                        TsLit::BigInt(v) => Expr::Lit(Lit::BigInt(v)),
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
                            pat: Pat::Ident(id.clone().into()),
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
                                            kind: StrKind::Normal {
                                                contains_quote: false,
                                            },
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
                        left: PatOrExpr::Pat(Pat::Ident(id.clone().into()).into()),
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

    /// Returns `(var_decl, init)`.
    fn handle_ts_module(&mut self, module: TsModuleDecl) -> Option<(Decl, Stmt)> {
        if module.global {
            return None;
        }

        let module_name = match module.id {
            TsModuleName::Ident(i) => i,
            TsModuleName::Str(_) => return None,
        };
        let body = module.body?;
        let mut body = match body {
            TsNamespaceBody::TsModuleBlock(body) => body,
            TsNamespaceBody::TsNamespaceDecl(_) => return None,
        };

        let mut init_stmts = vec![];

        let var = VarDeclarator {
            span: module_name.span,
            name: Pat::Ident(module_name.clone().into()),
            init: None,
            definite: false,
        };

        // This makes body valid javascript.
        body.body.visit_mut_with(self);
        if body.body.is_empty() {
            return None;
        }

        let private_name = private_ident!(module_name.sym.clone());
        let mut delayed_vars = vec![];

        for item in body.body {
            // Drop

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span, decl, ..
                })) => {
                    let decl_name = match decl {
                        Decl::Class(ref c) => c.ident.clone(),
                        Decl::Fn(ref f) => f.ident.clone(),
                        Decl::Var(v) => {
                            let mut exprs = vec![];
                            for decl in v.decls {
                                let init = match decl.init {
                                    Some(v) => v,
                                    None => {
                                        // We should handle enums

                                        match &decl.name {
                                            Pat::Ident(name) => {
                                                delayed_vars.push(name.id.clone());
                                                init_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                                    span: DUMMY_SP,
                                                    kind: v.kind,
                                                    declare: false,
                                                    decls: vec![decl],
                                                })))
                                            }
                                            _ => {}
                                        }

                                        continue;
                                    }
                                };
                                match decl.name {
                                    Pat::Ident(name) => {
                                        //
                                        let left =
                                            PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: private_name.clone().as_obj(),
                                                prop: Box::new(Expr::Ident(name.id.clone())),
                                                computed: false,
                                            })));

                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left,
                                            right: init,
                                        })))
                                    }
                                    _ => {
                                        let pat =
                                            Box::new(create_prop_pat(&private_name, decl.name));
                                        // Destructure the variable.
                                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left: PatOrExpr::Pat(pat),
                                            right: init,
                                        })))
                                    }
                                }
                            }
                            if !exprs.is_empty() {
                                init_stmts.push(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: if exprs.len() == 1 {
                                        exprs.into_iter().next().unwrap()
                                    } else {
                                        Box::new(Expr::Seq(SeqExpr {
                                            span: DUMMY_SP,
                                            exprs,
                                        }))
                                    },
                                }));
                            }

                            // TODO: Implement this using alias.
                            continue;
                        }
                        Decl::TsInterface(_)
                        | Decl::TsTypeAlias(_)
                        | Decl::TsEnum(_)
                        | Decl::TsModule(_) => continue,
                    };
                    init_stmts.push(Stmt::Decl(decl));

                    //
                    let left = PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: private_name.clone().as_obj(),
                        prop: Box::new(Expr::Ident(decl_name.clone())),
                        computed: false,
                    })));

                    let right = Box::new(Expr::Ident(decl_name));

                    init_stmts.push(Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left,
                            right,
                        })),
                    }))
                }

                ModuleItem::Stmt(stmt) => init_stmts.push(stmt),
                _ => {}
            }
        }

        if !delayed_vars.is_empty() {
            init_stmts.push(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: delayed_vars
                        .into_iter()
                        .map(|id| {
                            //
                            let mut prop = id.clone();
                            prop.span.ctxt = SyntaxContext::empty();
                            Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: private_name.clone().as_obj(),
                                    prop: Box::new(Expr::Ident(prop)),
                                    computed: false,
                                }))),
                                right: Box::new(Expr::Ident(id)),
                            })
                        })
                        .map(Box::new)
                        .collect(),
                })),
            }))
        }

        let init_fn_expr = FnExpr {
            ident: None,
            function: Function {
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(private_name.clone().into()),
                }],
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: init_stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: Default::default(),
                return_type: Default::default(),
            },
        };

        let init_arg = BinExpr {
            span: DUMMY_SP,
            left: Box::new(Expr::Ident(module_name.clone())),
            op: op!("||"),
            right: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Pat(Box::new(Pat::Ident(module_name.clone().into()))),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: Default::default(),
                })),
            })),
        };

        let initializer = Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: init_fn_expr.as_callee(),
            args: vec![init_arg.as_arg()],
            type_args: Default::default(),
        }));

        Some((
            Decl::Var(VarDecl {
                span: module.span,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![var],
            }),
            Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: initializer,
            }),
        ))
    }
}

impl Visit for Strip {
    fn visit_ident(&mut self, n: &Ident, _: &dyn Node) {
        let is_type_only_export = self.is_type_only_export;
        self.scope
            .imported_idents
            .entry((n.sym.clone(), n.span.ctxt()))
            .and_modify(|v| v.has_concrete |= !is_type_only_export);

        n.visit_children_with(self);
    }

    fn visit_decl(&mut self, n: &Decl, _: &dyn Node) {
        self.handle_decl(n);

        let old = self.non_top_level;
        self.non_top_level = true;
        n.visit_children_with(self);
        self.non_top_level = old;
    }

    fn visit_stmts(&mut self, n: &[Stmt], _: &dyn Node) {
        let old = self.non_top_level;
        self.non_top_level = true;
        n.iter()
            .for_each(|n| n.visit_with(&Invalid { span: DUMMY_SP }, self));
        self.non_top_level = old;
    }

    fn visit_module_items(&mut self, n: &[ModuleItem], _: &dyn Node) {
        let old = self.non_top_level;
        self.non_top_level = false;
        n.iter().for_each(|n| {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) = n {
                self.is_type_only_export = export.type_only;
            }
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
            self.is_type_only_export = false;
        });
        self.non_top_level = old;
    }

    fn visit_import_decl(&mut self, n: &ImportDecl, _: &dyn Node) {
        macro_rules! store {
            ($i:expr) => {{
                self.scope
                    .imported_idents
                    .insert(($i.sym.clone(), $i.span.ctxt()), Default::default());
            }};
        }
        for s in &n.specifiers {
            match *s {
                ImportSpecifier::Default(ref import) => store!(import.local),
                ImportSpecifier::Named(ref import) => store!(import.local),
                ImportSpecifier::Namespace(..) => {}
            }
        }
    }

    fn visit_ts_entity_name(&mut self, name: &TsEntityName, _: &dyn Node) {
        match *name {
            TsEntityName::Ident(ref i) => {
                self.scope
                    .imported_idents
                    .entry((i.sym.clone(), i.span.ctxt()))
                    .and_modify(|v| v.has_type = true);
            }
            TsEntityName::TsQualifiedName(ref q) => q.left.visit_with(&*q, self),
        }
    }
}

macro_rules! type_to_none {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut Option<$T>) {
            *node = None;
        }
    };
}

impl VisitMut for Strip {
    fn visit_mut_array_pat(&mut self, n: &mut ArrayPat) {
        n.visit_mut_children_with(self);
        n.optional = false;
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        n.is_abstract = false;

        n.type_params = None;

        n.super_type_params = None;

        n.implements = Default::default();

        n.decorators.visit_mut_with(self);
        n.body.visit_mut_with(self);
        n.super_class.visit_mut_with(self);
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.visit_mut_children_with(self);

        let mut stmts = vec![];

        n.params.map_with_mut(|params| {
            params.move_map(|param| match param {
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
                                ThisExpr { span: DUMMY_SP }.make_member(ident.id.clone()),
                            )),
                            op: op!("="),
                            right: Box::new(Expr::Ident(ident.id)),
                        }
                        .into_stmt(),
                    );

                    ParamOrTsParamProp::Param(param)
                }
            })
        });

        n.body = match n.body.take() {
            Some(mut body) => {
                prepend_stmts(&mut body.stmts, stmts.into_iter());
                Some(body)
            }
            None => None,
        };
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        let mut stack = vec![n];
        loop {
            let mut new_stack = vec![];
            for expr in stack {
                let res = self.handle_expr(expr);

                new_stack.extend(res)
            }

            if new_stack.is_empty() {
                return;
            }

            stack = new_stack;
        }
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.optional = false;
        i.visit_mut_children_with(self);
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);
        let span = s.span;

        s.cons.map_with_mut(|cons| match *cons {
            Stmt::Decl(Decl::TsEnum(e)) => {
                let mut stmts = vec![];
                self.handle_enum(e, &mut stmts);
                Box::new(Stmt::Block(BlockStmt { span, stmts }))
            }
            _ => cons,
        });

        s.alt.map_with_mut(|alt| {
            alt.map(|s| match *s {
                Stmt::Decl(Decl::TsEnum(e)) => {
                    let mut stmts = vec![];
                    self.handle_enum(e, &mut stmts);
                    Box::new(Stmt::Block(BlockStmt { span, stmts }))
                }
                _ => s,
            })
        })
    }

    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        self.is_side_effect_import = import.specifiers.is_empty();

        import.specifiers.retain(|s| match *s {
            ImportSpecifier::Default(ImportDefaultSpecifier { ref local, .. })
            | ImportSpecifier::Named(ImportNamedSpecifier { ref local, .. }) => {
                let entry = self
                    .scope
                    .imported_idents
                    .get(&(local.sym.clone(), local.span.ctxt()));
                match entry {
                    Some(&DeclInfo {
                        has_concrete: false,
                        ..
                    }) => false,
                    _ => true,
                }
            }
            _ => true,
        });

        if import.specifiers.is_empty() && !self.is_side_effect_import {
            self.is_side_effect_import = match self.config.import_not_used_as_values {
                ImportNotUsedAsValues::Remove => false,
                ImportNotUsedAsValues::Preserve => true,
            };
        }
    }

    fn visit_mut_object_pat(&mut self, pat: &mut ObjectPat) {
        pat.visit_mut_children_with(self);
        pat.optional = false;
    }

    fn visit_mut_private_prop(&mut self, prop: &mut PrivateProp) {
        prop.visit_mut_children_with(self);
        prop.readonly = false;
    }

    fn visit_mut_class_prop(&mut self, prop: &mut ClassProp) {
        prop.visit_mut_children_with(self);
        prop.readonly = false;
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        stmt.visit_mut_children_with(self);

        match stmt {
            Stmt::Decl(ref decl) => match decl {
                Decl::TsInterface(..)
                | Decl::TsTypeAlias(..)
                | Decl::Var(VarDecl { declare: true, .. })
                | Decl::Class(ClassDecl { declare: true, .. })
                | Decl::Fn(FnDecl { declare: true, .. }) => {
                    let span = decl.span();
                    *stmt = Stmt::Empty(EmptyStmt { span })
                }

                _ => {}
            },

            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, orig: &mut Vec<Stmt>) {
        // Second pass
        let mut stmts = Vec::with_capacity(orig.len());
        for mut item in take(orig) {
            self.is_side_effect_import = false;
            match item {
                Stmt::Empty(..) => continue,

                Stmt::Decl(Decl::TsModule(module)) => {
                    let (decl, init) = match self.handle_ts_module(module) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.push(Stmt::Decl(decl));
                    stmts.push(init)
                }

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
                            name: Pat::Ident(e.id.clone().into()),
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
                | Stmt::Decl(Decl::TsTypeAlias(..)) => continue,

                _ => {
                    item.visit_mut_with(self);
                    stmts.push(item);
                }
            };
        }

        *orig = stmts
    }

    fn visit_mut_ts_interface_decl(&mut self, n: &mut TsInterfaceDecl) {
        n.type_params = None;
    }

    fn visit_mut_ts_type_alias_decl(&mut self, node: &mut TsTypeAliasDecl) {
        node.type_params = None;
    }

    type_to_none!(visit_mut_opt_ts_type, Box<TsType>);
    type_to_none!(visit_mut_opt_ts_type_ann, TsTypeAnn);
    type_to_none!(visit_mut_opt_ts_type_param_decl, TsTypeParamDecl);
    type_to_none!(
        visit_mut_opt_ts_type_param_instantiation,
        TsTypeParamInstantiation
    );

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        members.visit_mut_children_with(self);

        members.retain(|member| match *member {
            ClassMember::TsIndexSignature(..) => false,
            ClassMember::Constructor(Constructor { body: None, .. }) => false,
            ClassMember::Method(ClassMethod {
                is_abstract: true, ..
            })
            | ClassMember::Method(ClassMethod {
                function: Function { body: None, .. },
                ..
            }) => false,
            ClassMember::ClassProp(ClassProp {
                value: None,
                ref decorators,
                ..
            }) if decorators.is_empty() => false,

            _ => true,
        });
    }

    fn visit_mut_opt_accessibility(&mut self, n: &mut Option<Accessibility>) {
        *n = None;
    }

    /// Remove `this` from parameter list
    fn visit_mut_params(&mut self, params: &mut Vec<Param>) {
        params.visit_mut_children_with(self);

        params.retain(|param| match param.pat {
            Pat::Ident(BindingIdent {
                id:
                    Ident {
                        sym: js_word!("this"),
                        ..
                    },
                ..
            }) => false,
            _ => true,
        });
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        items.visit_with(&Invalid { span: DUMMY_SP }, self);

        let mut stmts = Vec::with_capacity(items.len());
        for mut item in take(items) {
            self.is_side_effect_import = false;
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl: Decl::TsModule(module),
                    ..
                })) => {
                    let (decl, init) = match self.handle_ts_module(module) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span,
                        decl,
                    })));
                    stmts.push(init.into())
                }

                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(module))) => {
                    let (decl, init) = match self.handle_ts_module(module) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.push(Stmt::Decl(decl).into());
                    stmts.push(init.into())
                }

                // Strip out ts-only extensions
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                    function: Function { body: None, .. },
                    ..
                })))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsInterface(..),
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
                | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(ClassDecl { declare: true, .. }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(VarDecl { declare: true, .. }),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsEnum(TsEnumDecl { declare: true, .. }),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl { declare: true, .. })))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl { declare: true, .. }))) => {
                    continue
                }

                // Always strip type only import / exports
                ModuleItem::Stmt(Stmt::Empty(..))
                | ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    type_only: true, ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    type_only: true,
                    ..
                })) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::Import(mut i)) => {
                    i.visit_mut_with(self);

                    if self.is_side_effect_import || !i.specifiers.is_empty() {
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
                                name: Pat::Ident(e.id.clone().into()),
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
                                name: Pat::Ident(e.id.clone().into()),
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
                                name: Pat::Ident(import.id.into()),
                                init: Some(Box::new(module_ref_to_expr(import.module_ref))),
                                definite: false,
                            }],
                            declare: false,
                        }),
                    })));
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => {
                    let mut item = ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                        span: export.span(),
                        expr: export.expr,
                    });
                    item.visit_mut_with(self);
                    stmts.push(ModuleItem::ModuleDecl(item))
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // if specifier become empty, we remove export statement.

                    if export.type_only {
                        export.specifiers.clear();
                    }
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

                _ => {
                    item.visit_mut_with(self);
                    stmts.push(item)
                }
            };
        }

        *items = stmts;
    }

    fn visit_mut_var_declarator(&mut self, d: &mut VarDeclarator) {
        d.visit_mut_children_with(self);
        d.definite = false;
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

fn create_prop_pat(obj: &Ident, pat: Pat) -> Pat {
    match pat {
        Pat::Invalid(_) => pat,

        Pat::Ident(i) => Pat::Expr(Box::new(Expr::Member(MemberExpr {
            span: i.id.span,
            obj: obj.clone().as_obj(),
            prop: Box::new(Expr::Ident(i.id)),
            computed: false,
        }))),
        Pat::Array(p) => Pat::Array(ArrayPat {
            elems: p
                .elems
                .into_iter()
                .map(|elem| Some(create_prop_pat(obj, elem?)))
                .collect(),
            ..p
        }),
        Pat::Rest(_) => {
            todo!("Rest pattern in an exported variable from namespace")
        }
        Pat::Object(p) => Pat::Object(ObjectPat {
            props: p
                .props
                .into_iter()
                .map(|prop| match prop {
                    ObjectPatProp::KeyValue(kv) => ObjectPatProp::KeyValue(KeyValuePatProp {
                        value: Box::new(create_prop_pat(obj, *kv.value)),
                        ..kv
                    }),
                    ObjectPatProp::Assign(..) => prop,
                    ObjectPatProp::Rest(_) => {
                        todo!("Rest pattern property in an exported variable from namespace")
                    }
                })
                .collect(),
            ..p
        }),
        Pat::Assign(p) => Pat::Assign(AssignPat {
            left: Box::new(create_prop_pat(obj, *p.left)),
            ..p
        }),
        // TODO
        Pat::Expr(..) => pat,
    }
}
