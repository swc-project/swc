use std::mem::take;

use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    chain,
    collections::{AHashMap, AHashSet},
    comments::{Comments, NoopComments},
    sync::Lrc,
    util::{move_map::MoveMap, take::Take},
    Mark, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_react::{parse_expr_for_jsx, JsxDirectives};
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, is_literal, member_expr, prepend_stmt,
    private_ident, prop_name_to_expr, quote_ident, var::VarCollector, ExprFactory,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, visit_obj_and_computed, Fold, Visit, VisitMut, VisitMutWith,
    VisitWith,
};

use crate::inline_enum::{inline_enum, TSEnumLit};

/// Value does not contain TsLit::Bool
type EnumValues = AHashMap<JsWord, Option<TsLit>>;

#[derive(Debug, Serialize, Deserialize)]
#[non_exhaustive]
pub enum ImportsNotUsedAsValues {
    #[serde(rename = "remove")]
    Remove,
    #[serde(rename = "preserve")]
    Preserve,
}

#[deprecated = "ImportNotUsedAsValues is renamed to ImportsNotUsedAsValues"]
pub type ImportNotUsedAsValues = ImportsNotUsedAsValues;

/// This value defaults to `Remove`
impl Default for ImportsNotUsedAsValues {
    fn default() -> Self {
        Self::Remove
    }
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub import_not_used_as_values: ImportsNotUsedAsValues,
    /// Align the semantics of TS class fields with TC39 class fields. Defaults
    /// to `false`.
    ///
    /// See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier.
    ///
    /// When running `tsc` with configuration `"target": "ESNext",
    /// "useDefineForClassFields": true`, TS class fields are preserved as JS
    /// class fields. We target ESNext, so this our behavior with
    /// `use_define_for_class_fields: true`.
    ///
    /// When running `tsc` with configuration `"target": "<ES6-ES2020>",
    /// "useDefineForClassFields": true`, TS class fields are transformed to
    /// `Object.defineProperty()` statements. You must additionally apply the
    /// `swc_ecmascript::transforms::compat::es2022::class_properties()` pass to
    /// get this backward-compatible output.
    #[serde(default)]
    pub use_define_for_class_fields: bool,

    /// Don't create `export {}`.
    /// By default, strip creates `export {}` for modules to preserve module
    /// context.
    ///
    /// https://github.com/swc-project/swc/issues/1698
    #[serde(default)]
    pub no_empty_export: bool,

    /// Note: this pass handle jsx directives in comments
    #[serde(default)]
    pub pragma: Option<String>,

    /// Note: this pass handle jsx directives in comments
    #[serde(default)]
    pub pragma_frag: Option<String>,

    #[serde(default)]
    pub ts_enum_config: TSEnumConfig,
}

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct TSEnumConfig {
    /// Note: `const enum` will be inlined if this is false(default)
    /// All `const enum` *should be* inlined since it's align to tsc behavior.
    /// This option exists to allow you to roll back the old behavior of swc.
    #[serde(default)]
    pub treat_const_enum_as_enum: bool,

    /// Config from `assumptions`
    /// Note: If this is true, all enums will be inlined when possible
    /// whether or not you use `enum` or `const enum`.
    #[serde(default)]
    pub ts_enum_is_readonly: bool,
}

impl TSEnumConfig {
    pub fn should_collect_enum(&self, is_const: bool) -> bool {
        self.ts_enum_is_readonly || (!self.treat_const_enum_as_enum && is_const)
    }
}

pub fn strip_with_config(config: Config, top_level_mark: Mark) -> impl Fold + VisitMut {
    let ts_enum_lit = TSEnumLit::default();

    let ts_enum_config = config.ts_enum_config;

    chain!(
        as_folder(Strip {
            config,
            comments: NoopComments,
            jsx: None,
            top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
            ts_enum_lit: ts_enum_lit.clone(),
            non_top_level: Default::default(),
            scope: Default::default(),
            is_side_effect_import: Default::default(),
            is_type_only_export: Default::default(),
            uninitialized_vars: Default::default(),
            decl_names: Default::default(),
            in_var_pat: Default::default(),
            keys: Default::default()
        }),
        inline_enum(ts_enum_lit, ts_enum_config)
    )
}

/// Strips type annotations out.
///
/// See the `examples` directory of the crate to see how you can transpile a
/// typescript file to a javascript file.
pub fn strip(top_level_mark: Mark) -> impl Fold + VisitMut {
    strip_with_config(Default::default(), top_level_mark)
}

/// [strip], but aware of jsx.
///
/// If you are using jsx, you should use this before jsx pass.
pub fn strip_with_jsx<C>(
    cm: Lrc<SourceMap>,
    config: Config,
    comments: C,
    top_level_mark: Mark,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    let pragma = parse_expr_for_jsx(
        &cm,
        "pragma",
        config
            .pragma
            .clone()
            .unwrap_or_else(|| "React.createElement".to_string()),
        top_level_mark,
    );

    let pragma_frag = parse_expr_for_jsx(
        &cm,
        "pragma",
        config
            .pragma_frag
            .clone()
            .unwrap_or_else(|| "React.Fragment".to_string()),
        top_level_mark,
    );

    let pragma_id = id_for_jsx(&pragma);
    let pragma_frag_id = id_for_jsx(&pragma_frag);

    let ts_enum_lit = TSEnumLit::default();
    let ts_enum_config = config.ts_enum_config;

    chain!(
        as_folder(Strip {
            config,
            comments,
            jsx: Some(JsxData {
                cm,
                top_level_mark,
                pragma_id,
                pragma_frag_id,
            }),
            top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
            ts_enum_lit: ts_enum_lit.clone(),
            non_top_level: Default::default(),
            scope: Default::default(),
            is_side_effect_import: Default::default(),
            is_type_only_export: Default::default(),
            uninitialized_vars: Default::default(),
            decl_names: Default::default(),
            in_var_pat: Default::default(),
            keys: Default::default(),
        }),
        inline_enum(ts_enum_lit, ts_enum_config)
    )
}

/// Get an [Id] which will used by expression.
///
/// For `React#1.createElement`, this returns `React#1`.
fn id_for_jsx(e: &Expr) -> Id {
    match e {
        Expr::Ident(i) => i.to_id(),
        Expr::Member(MemberExpr { obj, .. }) => id_for_jsx(obj),
        _ => {
            panic!("failed to determine top-level Id for jsx expression")
        }
    }
}

struct JsxData {
    cm: Lrc<SourceMap>,
    top_level_mark: Mark,

    pragma_id: Id,
    pragma_frag_id: Id,
}

struct Strip<C>
where
    C: Comments,
{
    config: Config,

    comments: C,
    jsx: Option<JsxData>,

    non_top_level: bool,
    top_level_ctxt: SyntaxContext,
    scope: Scope,

    is_side_effect_import: bool,
    is_type_only_export: bool,
    uninitialized_vars: Vec<VarDeclarator>,

    ts_enum_lit: TSEnumLit,

    /// Names of declarations.
    /// This is used to prevent emitting a variable with same name multiple
    /// name.
    ///
    /// If an identifier is in this list, the [VisitMut] impl should not add a
    /// variable with it.
    ///
    /// This field is filled by [Visit] impl and [VisitMut] impl.
    decl_names: AHashSet<Id>,
    in_var_pat: bool,

    keys: Vec<VarDeclarator>,
}

impl<C> Strip<C>
where
    C: Comments,
{
    /// If we found required jsx directives, we returns true.
    fn parse_jsx_directives(&mut self, span: Span) -> bool {
        let jsx_data = match &mut self.jsx {
            Some(v) => v,
            None => return false,
        };
        let cm = jsx_data.cm.clone();
        let top_level_mark = jsx_data.top_level_mark;

        let mut found = false;

        let directives = self.comments.with_leading(span.lo, |comments| {
            JsxDirectives::from_comments(&cm, span, comments, top_level_mark)
        });

        let JsxDirectives {
            pragma,
            pragma_frag,
            ..
        } = directives;

        if let Some(pragma) = pragma {
            found = true;
            jsx_data.pragma_id = id_for_jsx(&pragma);
        }

        if let Some(pragma_frag) = pragma_frag {
            found = true;
            jsx_data.pragma_frag_id = id_for_jsx(&pragma_frag);
        }

        found
    }
}

impl<C> Strip<C>
where
    C: Comments,
{
    /// Creates an uninitialized variable if `name` is not in scope.
    fn create_uninit_var(&mut self, span: Span, name: Id) -> Option<VarDeclarator> {
        if !self.decl_names.insert(name.clone()) {
            return None;
        }

        Some(VarDeclarator {
            span,
            name: Ident::new(name.0, DUMMY_SP.with_ctxt(name.1)).into(),
            init: None,
            definite: false,
        })
    }
}

#[derive(Default)]
struct Scope {
    decls: AHashMap<Id, DeclInfo>,
    referenced_idents: AHashMap<Id, DeclInfo>,
}

#[derive(Debug, Default)]
struct DeclInfo {
    /// Var, Fn, Class
    has_concrete: bool,
    /// In `import foo = bar.baz`, `foo`'s dependency is `bar`. This means that
    /// when setting `has_concrete` for `foo`, it must also be set for
    /// `bar`.
    maybe_dependency: Option<Ident>,
}

impl<C> Strip<C>
where
    C: Comments,
{
    fn store(&mut self, sym: JsWord, ctxt: SyntaxContext, concrete: bool) {
        let entry = self.scope.decls.entry((sym, ctxt)).or_default();

        if concrete {
            entry.has_concrete = true
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
                var.decls.visit_with(&mut VarCollector { to: &mut names });

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

impl<C> Strip<C>
where
    C: Comments,
{
    /// Returns [Some] if the method should be called again.
    fn handle_expr<'a>(&mut self, n: &'a mut Expr) -> Vec<&'a mut Expr> {
        match n {
            Expr::Bin(BinExpr { left, right, .. }) => return vec![&mut **left, &mut **right],

            // Remove types
            Expr::TsAs(TsAsExpr { expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
            | Expr::TsInstantiation(TsInstantiation { expr, .. }) => {
                expr.visit_mut_with(self);
                let expr = *expr.take();
                *n = expr;
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                obj.visit_mut_with(self);

                match prop {
                    MemberProp::Ident(i) => i.optional = false,
                    MemberProp::Computed(c) => c.visit_mut_with(self),
                    _ => (),
                }
            }

            Expr::SuperProp(SuperPropExpr { prop, .. }) => match prop {
                SuperProp::Ident(i) => i.optional = false,
                SuperProp::Computed(c) => c.visit_mut_with(self),
            },

            Expr::Class(class) => {
                let key_len = self.keys.len();
                class.visit_mut_with(self);

                let mut exprs: Vec<Box<Expr>> = self
                    .keys
                    .iter_mut()
                    .skip(key_len)
                    .map(|key| {
                        let value = key.init.take().unwrap();
                        let key = key.name.clone();
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(key.into()),
                            op: op!("="),
                            right: value,
                        }))
                    })
                    .collect();

                if !exprs.is_empty() {
                    exprs.push(Box::new(Expr::Class(class.take())));

                    *n = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    })
                }
            }

            _ => {
                n.visit_mut_children_with(self);
            }
        }

        vec![]
    }

    /// Returns `(var_decl, init)`.
    fn handle_enum(&mut self, e: TsEnumDecl, module_name: Option<&Ident>) -> (Option<Decl>, Stmt) {
        /// Called only for enums.
        ///
        /// If both of the default value and the initialization is None, this
        /// method returns [Err].
        fn compute(
            e: &TsEnumDecl,
            span: Span,
            values: &mut EnumValues,
            default: Option<i64>,
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
                                _ => return Err(()),
                            },
                            raw: None,
                        })
                    }
                    (TsLit::Str(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => {
                        let value = format!("{}{}", l.value, r.value);

                        TsLit::Str(Str {
                            span,
                            raw: None,
                            value: value.into(),
                        })
                    }
                    (TsLit::Number(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => {
                        let value = format!("{}{}", l.value, r.value);

                        TsLit::Str(Str {
                            span,
                            raw: None,
                            value: value.into(),
                        })
                    }
                    (TsLit::Str(l), TsLit::Number(r)) if expr.op == op!(bin, "+") => {
                        let value = format!("{}{}", l.value, r.value);

                        TsLit::Str(Str {
                            span,
                            raw: None,
                            value: value.into(),
                        })
                    }
                    _ => return Err(()),
                })
            }

            if let Some(expr) = init {
                match expr {
                    Expr::Lit(Lit::Str(s)) => return Ok(TsLit::Str(s.clone())),
                    Expr::Lit(Lit::Num(s)) => return Ok(TsLit::Number(s.clone())),
                    Expr::Bin(ref bin) => return compute_bin(e, span, values, bin),
                    Expr::Paren(ref paren) => {
                        return compute(e, span, values, default, Some(&paren.expr))
                    }

                    Expr::Ident(ref id) => {
                        if let Some(Some(v)) = values.get(&id.sym) {
                            return Ok(v.clone());
                        }
                        //
                        for m in e.members.iter() {
                            if &id.sym == m.id.as_ref() {
                                return compute(e, span, values, None, m.init.as_deref());
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
                                        _ => return Err(()),
                                    },
                                    raw: None,
                                }))
                            }
                            TsLit::Str(_) => {}
                            TsLit::Bool(_) => {}
                            TsLit::Tpl(_) => {}
                        }
                    }

                    Expr::Tpl(ref t) if t.exprs.is_empty() => {
                        if let Some(v) = &t.quasis[0].cooked {
                            return Ok(TsLit::Str(Str {
                                span,
                                raw: None,
                                value: v.into(),
                            }));
                        }
                    }

                    _ => {}
                }
            } else if let Some(value) = default {
                return Ok(TsLit::Number(Number {
                    span,
                    value: value as _,
                    raw: None,
                }));
            }

            Err(())
        }

        // let Foo;
        // (function (Foo) {
        //     Foo[Foo["a"] = 0] = "a";
        // })(Foo || (Foo = {}));

        let var = self.create_uninit_var(e.span, e.id.to_id()).map(|var| {
            Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: if e.id.span.ctxt != self.top_level_ctxt {
                    VarDeclKind::Let
                } else {
                    VarDeclKind::Var
                },
                declare: false,
                decls: vec![var],
            })
        });

        let id = e.id.clone();

        let mut default = 0;
        let mut values = Default::default();
        let members = e
            .members
            .clone()
            .into_iter()
            .map(|m| -> Result<_, ()> {
                let id_span = m.id.span();
                let val = compute(&e, id_span, &mut values, Some(default), m.init.as_deref())
                    .map(|val| {
                        if let TsLit::Number(ref n) = val {
                            default = n.value as i64 + 1;
                        }
                        values.insert(m.id.as_ref().clone(), Some(val.clone()));

                        match val {
                            TsLit::Number(v) => Expr::Lit(Lit::Num(v)),
                            TsLit::Str(v) => Expr::Lit(Lit::Str(v)),
                            TsLit::Bool(v) => Expr::Lit(Lit::Bool(v)),
                            TsLit::Tpl(v) => {
                                let value = v.quasis.into_iter().next().unwrap().raw;

                                Expr::Lit(Lit::Str(Str {
                                    span: v.span,
                                    raw: None,
                                    value,
                                }))
                            }
                            TsLit::BigInt(v) => Expr::Lit(Lit::BigInt(v)),
                        }
                    })
                    .or_else(|err| match &m.init {
                        None => Err(err),
                        Some(v) => {
                            let mut v = *v.clone();
                            let mut visitor = EnumValuesVisitor {
                                previous: &values,
                                ident: &id,
                            };
                            visitor.visit_mut_expr(&mut v);

                            values.insert(m.id.as_ref().clone(), None);

                            Ok(v)
                        }
                    })?;

                Ok((m, val))
            })
            .collect::<Result<Vec<_>, _>>()
            .unwrap_or_else(|_| panic!("invalid value for enum is detected"));

        let contains_lit = members.iter().any(|(_, v)| matches!(v, Expr::Lit(..)));
        let should_collect = self.config.ts_enum_config.should_collect_enum(e.is_const);

        if should_collect && contains_lit {
            let mut enums = self.ts_enum_lit.borrow_mut();

            let k_v = enums.entry(e.id.to_id()).or_default();

            members
                .iter()
                .filter(|(_, v)| matches!(v, Expr::Lit(..)))
                .for_each(|(m, e)| {
                    let member_key = m.id.as_ref().clone();
                    let value = e.clone().expect_lit();

                    k_v.insert(member_key, value);
                })
        }

        let init = CallExpr {
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
                        pat: id.clone().into(),
                    }],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: members
                            .into_iter()
                            .map(|(m, val)| {
                                let no_init_required = matches!(val, Expr::Lit(Lit::Str(..)));
                                let rhs_should_be_name = match &val {
                                    Expr::Lit(Lit::Str(s)) => m.id.as_ref() == &s.value,
                                    _ => true,
                                };

                                let value = match m.id {
                                    TsEnumMemberId::Str(s) => s,
                                    TsEnumMemberId::Ident(i) => Str {
                                        span: i.span,
                                        raw: None,
                                        value: i.sym,
                                    },
                                };
                                let prop = if no_init_required {
                                    Box::new(Expr::Lit(Lit::Str(value.clone())))
                                } else {
                                    Box::new(Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                            span: DUMMY_SP,
                                            obj: Box::new(Expr::Ident(id.clone())),
                                            prop: MemberProp::Computed(ComputedPropName {
                                                span: DUMMY_SP,
                                                expr: Box::new(Expr::Lit(Lit::Str(value.clone()))),
                                            }),
                                        }))),
                                        op: op!("="),
                                        right: Box::new(val.clone()),
                                    }))
                                };

                                // Foo[Foo["a"] = 0] = "a";
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                        obj: Box::new(Expr::Ident(id.clone())),
                                        span: DUMMY_SP,

                                        // Foo["a"] = 0
                                        prop: MemberProp::Computed(ComputedPropName {
                                            span: DUMMY_SP,
                                            expr: prop,
                                        }),
                                    }))),
                                    op: op!("="),
                                    right: if rhs_should_be_name {
                                        Box::new(Expr::Lit(Lit::Str(value)))
                                    } else if m.init.is_some() {
                                        Box::new(val)
                                    } else {
                                        Box::new(Expr::Lit(Lit::Str(value)))
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
            args: vec![self.get_namespace_or_enum_init_arg(e.span, &id, module_name)],
            type_args: Default::default(),
        }
        .into_stmt();

        (var, init)
    }

    /// Returns `(var_decl, init)`.
    fn handle_ts_module(
        &mut self,
        module: TsModuleDecl,
        parent_module_name: Option<&Ident>,
    ) -> Option<(Option<Decl>, Stmt)> {
        if module.global || module.declare {
            return None;
        }

        let module_span = module.span;
        let module_name = match module.id {
            TsModuleName::Ident(i) => i,
            TsModuleName::Str(_) => return None,
        };

        let body = module.body?;
        let private_name = private_ident!(module_name.sym.clone());
        let body_stmts = match body {
            TsNamespaceBody::TsModuleBlock(block) => {
                self.handle_ts_module_block(block, &private_name)
            }
            TsNamespaceBody::TsNamespaceDecl(decl) => {
                self.handle_ts_namespace_decl(decl, &private_name)
            }
        }?;

        let var = self.create_uninit_var(module_name.span, module_name.to_id());

        self.get_namespace_var_decl_and_call_expr(
            var,
            body_stmts,
            module.span,
            parent_module_name,
            &module_name,
            &private_name,
        )
        .map(|(mut var, stmt)| {
            if let Some(var) = var.as_mut() {
                // for comments
                var.span = module_span;
                // ensure it's a var if top level
                if module_name.span.ctxt == self.top_level_ctxt {
                    var.kind = VarDeclKind::Var;
                }
            }
            (var.map(Decl::Var), stmt)
        })
    }

    fn handle_ts_namespace_decl(
        &mut self,
        decl: TsNamespaceDecl,
        parent_private_name: &Ident,
    ) -> Option<Vec<Stmt>> {
        let private_name = private_ident!(decl.id.sym.clone());
        // we'll always create a variable in this scenario
        let var_id = Ident::new(decl.id.sym.clone(), DUMMY_SP.with_ctxt(decl.id.span.ctxt));
        let var = VarDeclarator {
            span: DUMMY_SP,
            name: var_id.into(),
            init: None,
            definite: false,
        };

        let body_stmts = match *decl.body {
            TsNamespaceBody::TsModuleBlock(block) => {
                self.handle_ts_module_block(block, &private_name)
            }
            TsNamespaceBody::TsNamespaceDecl(decl) => {
                self.handle_ts_namespace_decl(decl, &private_name)
            }
        }?;

        let (var_decl, init_stmt) = self.get_namespace_var_decl_and_call_expr(
            Some(var),
            body_stmts,
            decl.span,
            Some(parent_private_name),
            &decl.id,
            &private_name,
        )?;
        let mut stmts = Vec::new();
        stmts.extend(var_decl.map(Decl::Var).map(Stmt::Decl));
        stmts.push(init_stmt);
        Some(stmts)
    }

    fn get_namespace_var_decl_and_call_expr(
        &self,
        var: Option<VarDeclarator>,
        body_stmts: Vec<Stmt>,
        decl_span: Span,
        parent_module_name: Option<&Ident>,
        module_name: &Ident,
        private_name: &Ident,
    ) -> Option<(Option<VarDecl>, Stmt)> {
        let init_fn_expr = FnExpr {
            ident: None,
            function: Function {
                params: vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: private_name.clone().into(),
                }],
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: body_stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: Default::default(),
                return_type: Default::default(),
            },
        };

        let initializer = Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: init_fn_expr.as_callee(),
            args: vec![self.get_namespace_or_enum_init_arg(
                decl_span,
                module_name,
                parent_module_name,
            )],
            type_args: Default::default(),
        }));

        Some((
            var.map(|var| VarDecl {
                span: DUMMY_SP,
                kind: if module_name.span.ctxt != self.top_level_ctxt {
                    VarDeclKind::Let
                } else {
                    VarDeclKind::Var
                },
                declare: false,
                decls: vec![var],
            }),
            Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: initializer,
            }),
        ))
    }

    fn handle_ts_module_block(
        &mut self,
        block: TsModuleBlock,
        private_module_name: &Ident,
    ) -> Option<Vec<Stmt>> {
        let stmts = self.handle_module_items(block.body, Some(private_module_name));

        if stmts.is_empty() {
            None
        } else {
            Some(
                stmts
                    .into_iter()
                    .filter_map(|item| {
                        match item {
                            ModuleItem::Stmt(stmt) => Some(stmt),
                            _ => None, // do not emit these as they are not valid in a module block
                        }
                    })
                    .collect(),
            )
        }
    }

    fn handle_module_items(
        &mut self,
        items: Vec<ModuleItem>,
        parent_module_name: Option<&Ident>,
    ) -> Vec<ModuleItem> {
        let mut delayed_vars = vec![];

        items.visit_with(self);

        let mut stmts = Vec::with_capacity(items.len());
        for mut item in items {
            self.is_side_effect_import = false;
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl: Decl::TsModule(module),
                    ..
                })) => {
                    let (decl, init) = match self.handle_ts_module(module, parent_module_name) {
                        Some(v) => v,
                        None => continue,
                    };

                    stmts.extend(decl.map(|decl| {
                        if parent_module_name.is_none() {
                            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl,
                            }))
                        } else {
                            ModuleItem::Stmt(Stmt::Decl(decl))
                        }
                    }));
                    stmts.push(init.into())
                }

                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(module))) => {
                    let (decl, init) = match self.handle_ts_module(module, None) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.extend(decl.map(Stmt::Decl).map(ModuleItem::Stmt));
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

                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(TsImportEqualsDecl {
                    span,
                    declare: false,
                    is_export: false,
                    is_type_only: false,
                    id,
                    module_ref:
                        TsModuleRef::TsExternalModuleRef(TsExternalModuleRef { span: _, expr }),
                })) => {
                    let default = VarDeclarator {
                        span: DUMMY_SP,
                        name: id.into(),
                        init: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("require").as_callee(),
                            args: vec![expr.as_arg()],
                            type_args: None,
                        }))),
                        definite: false,
                    };
                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![default],
                    }))))
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
                    let (decl, init) = self.handle_enum(e, parent_module_name);

                    stmts.extend(decl.map(|decl| {
                        if parent_module_name.is_none() {
                            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                span: DUMMY_SP,
                                decl,
                            }))
                        } else {
                            ModuleItem::Stmt(Stmt::Decl(decl))
                        }
                    }));
                    stmts.push(ModuleItem::Stmt(init));
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(e))) => {
                    let (decl, init) = self.handle_enum(e, None);
                    stmts.extend(decl.map(|decl| ModuleItem::Stmt(Stmt::Decl(decl))));
                    stmts.push(ModuleItem::Stmt(init));
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
                    let maybe_entry = self.scope.referenced_idents.get(&import.id.to_id());
                    let has_concrete = if let Some(entry) = maybe_entry {
                        entry.has_concrete
                    } else {
                        true
                    };
                    // TODO(nayeemrmn): For some reason TSC preserves `import foo = bar.baz`
                    // when `bar.baz` is not defined, even if `foo` goes unused. We can't currently
                    // identify that case so we strip it anyway.
                    if !import.is_type_only && (has_concrete || import.is_export) {
                        let var = Decl::Var(VarDecl {
                            span: import.span,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: import.id.clone().into(),
                                init: Some(Box::new(module_ref_to_expr(import.module_ref))),
                                definite: false,
                            }],
                            declare: false,
                        });
                        if import.is_export {
                            if let Some(parent_module_name) = parent_module_name {
                                stmts.push(ModuleItem::Stmt(Stmt::Decl(var)));
                                stmts.push(ModuleItem::Stmt(
                                    self.get_namespace_child_decl_assignment(
                                        parent_module_name,
                                        import.id,
                                    ),
                                ));
                            } else {
                                stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                                    ExportDecl {
                                        span: DUMMY_SP,
                                        decl: var,
                                    },
                                )));
                            }
                        } else {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(var)));
                        }
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(mut export)) => {
                    export.expr.visit_mut_with(self);

                    stmts.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: export.span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: export.span,
                            left: PatOrExpr::Expr(member_expr!(DUMMY_SP, module.exports)),
                            op: op!("="),
                            right: export.expr,
                        })),
                    })));
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // if specifier become empty, we remove export statement.

                    if export.type_only {
                        export.specifiers.clear();
                    }
                    export.specifiers.retain(|s| match *s {
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            ref orig,
                            ref is_type_only,
                            ..
                        }) => {
                            let orig_ident = match orig {
                                ModuleExportName::Ident(ident) => ident,
                                ModuleExportName::Str(..) => return true,
                            };
                            if *is_type_only {
                                false
                            } else if let Some(e) = self.scope.decls.get(&orig_ident.to_id()) {
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

                // handle TS namespace child exports
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(mut class_decl),
                    ..
                })) if parent_module_name.is_some() => {
                    class_decl.visit_mut_with(self);
                    let assignment = self.get_namespace_child_decl_assignment(
                        parent_module_name.unwrap(),
                        class_decl.ident.clone(),
                    );
                    stmts.push(ModuleItem::Stmt(Stmt::Decl(class_decl.into())));
                    stmts.push(ModuleItem::Stmt(assignment));
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(mut fn_decl),
                    ..
                })) if parent_module_name.is_some() => {
                    fn_decl.visit_mut_with(self);
                    let assignment = self.get_namespace_child_decl_assignment(
                        parent_module_name.unwrap(),
                        fn_decl.ident.clone(),
                    );
                    stmts.push(ModuleItem::Stmt(Stmt::Decl(fn_decl.into())));
                    stmts.push(ModuleItem::Stmt(assignment));
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(mut v),
                    ..
                })) if parent_module_name.is_some() => {
                    let parent_module_name = parent_module_name.unwrap();
                    v.visit_mut_with(self);
                    let mut exprs = vec![];
                    for decl in v.decls {
                        let init = match decl.init {
                            Some(v) => v,
                            None => {
                                if let Pat::Ident(name) = &decl.name {
                                    delayed_vars.push(name.id.clone());
                                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: v.kind,
                                        declare: false,
                                        decls: vec![decl],
                                    }))));
                                }

                                continue;
                            }
                        };
                        match decl.name {
                            Pat::Ident(name) => {
                                //
                                let left = Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: Box::new(Expr::Ident(parent_module_name.clone())),
                                    prop: MemberProp::Ident(name.id.clone()),
                                }))
                                .into();

                                let expr = AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left,
                                    right: init,
                                }
                                .into();

                                let decl = VarDeclarator {
                                    span: name.id.span,
                                    name: name.clone().into(),
                                    init: Some(Box::new(expr)),
                                    definite: false,
                                };

                                let stmt: Stmt = Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![decl],
                                })
                                .into();

                                stmts.push(stmt.into());
                            }
                            _ => {
                                let pat = Box::new(create_prop_pat(parent_module_name, decl.name));
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
                        stmts.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: if exprs.len() == 1 {
                                exprs.into_iter().next().unwrap()
                            } else {
                                Box::new(Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs,
                                }))
                            },
                        })));
                    }
                }

                _ => {
                    item.visit_mut_with(self);
                    stmts.push(item)
                }
            };
        }

        if !delayed_vars.is_empty() {
            stmts.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
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
                                    obj: Box::new(Expr::Ident(parent_module_name.unwrap().clone())),
                                    prop: MemberProp::Ident(prop),
                                }))),
                                right: Box::new(Expr::Ident(id)),
                            })
                        })
                        .map(Box::new)
                        .collect(),
                })),
            })));
        }

        stmts
    }

    /// Gets the argument used in a transformed enum or namespace call expr.
    ///
    /// Example:
    ///   * `MyEnum = MyNamespace.MyEnum || (MyNamespace.MyEnum = {}`
    ///   * or `MyEnum || (MyEnum = {})`
    fn get_namespace_or_enum_init_arg(
        &self,
        decl_span: Span,
        id: &Ident,
        module_name: Option<&Ident>,
    ) -> ExprOrSpread {
        if let Some(module_name) = module_name {
            let namespace_ref = Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(module_name.clone())),
                prop: MemberProp::Ident(Ident::new(
                    id.sym.clone(),
                    DUMMY_SP.with_ctxt(decl_span.ctxt),
                )),
            }));
            AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(id.clone().into()),
                op: op!("="),
                right: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: namespace_ref.clone(),
                    op: op!("||"),
                    right: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Expr(namespace_ref),
                        op: op!("="),
                        right: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        })),
                    })),
                })),
            }
            .as_arg()
        } else {
            BinExpr {
                span: DUMMY_SP,
                left: Box::new(Expr::Ident(id.clone())),
                op: op!("||"),
                right: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(id.clone().into()),
                    op: op!("="),
                    right: Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    })),
                })),
            }
            .as_arg()
        }
    }

    /// Gets the assignment statement used to export certain declarations
    /// from a TS namespace.
    ///
    /// Example:
    ///   * `MyNamespace.ChildClass = ChildClass`
    fn get_namespace_child_decl_assignment(&self, module_name: &Ident, decl_name: Ident) -> Stmt {
        let left = PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(module_name.clone())),
            prop: MemberProp::Ident(decl_name.clone()),
        })));

        let right = Box::new(Expr::Ident(decl_name));

        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left,
                right,
            })),
        })
    }
}

impl<C> Visit for Strip<C>
where
    C: Comments,
{
    visit_obj_and_computed!();

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        if !self.in_var_pat {
            n.key.visit_with(self);
        } else {
            self.decl_names.insert(n.key.to_id());
        }
        n.value.visit_with(self);
    }

    fn visit_assign_prop(&mut self, n: &AssignProp) {
        n.value.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        if !self.in_var_pat {
            n.visit_children_with(self)
        } else {
            self.decl_names.insert(n.to_id());
        }
    }

    fn visit_decl(&mut self, n: &Decl) {
        self.handle_decl(n);

        let old = self.non_top_level;
        self.non_top_level = true;
        // Visit the declaration body and not the identifier. Otherwise
        // type declarations could be unintentionally marked as concrete
        // by the visit_ident function above.
        match n {
            Decl::Class(class) => {
                self.decl_names.insert(class.ident.to_id());
                class.class.visit_with(self);
            }
            Decl::Fn(f) => {
                self.decl_names.insert(f.ident.to_id());
                f.function.visit_with(self)
            }
            Decl::Var(ref var) => {
                let old = self.in_var_pat;
                for decl in &var.decls {
                    self.in_var_pat = true;
                    decl.name.visit_with(self);
                    self.in_var_pat = false;
                    decl.init.visit_with(self);
                }
                self.in_var_pat = old;
            }
            Decl::TsEnum(e) => {
                e.members.visit_with(self);
            }
            Decl::TsInterface(interface) => {
                interface.extends.visit_with(self);
                interface.body.visit_with(self);
            }
            Decl::TsModule(module) => {
                match &module.id {
                    TsModuleName::Ident(id) => {
                        self.decl_names.insert(id.to_id());
                    }
                    TsModuleName::Str(_) => {}
                }
                module.body.visit_with(self);
            }
            Decl::TsTypeAlias(alias) => {
                alias.type_params.visit_with(self);
                alias.type_ann.visit_with(self);
            }
        }
        self.non_top_level = old;
    }

    fn visit_ident(&mut self, n: &Ident) {
        let entry = self.scope.referenced_idents.entry(n.to_id()).or_default();
        if !self.is_type_only_export {
            entry.has_concrete = true;
        }
        if let Some(i) = &entry.maybe_dependency {
            let id = i.to_id();
            if let Some(entry) = self.scope.referenced_idents.get_mut(&id) {
                if !self.is_type_only_export {
                    entry.has_concrete = true;
                }
            }
        }
        n.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        for s in &n.specifiers {
            match s {
                ImportSpecifier::Default(ImportDefaultSpecifier { local, .. })
                | ImportSpecifier::Named(ImportNamedSpecifier { local, .. })
                | ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                    self.scope
                        .referenced_idents
                        .entry((local.sym.clone(), local.span.ctxt()))
                        .or_default();
                    if n.type_only {
                        self.scope.decls.entry(local.to_id()).or_default();
                    }
                }
            }
        }
    }

    fn visit_module_items(&mut self, n: &[ModuleItem]) {
        let old = self.non_top_level;
        self.non_top_level = false;
        n.iter().for_each(|n| {
            n.visit_with(self);
        });
        self.non_top_level = old;
    }

    fn visit_named_export(&mut self, export: &NamedExport) {
        let old = self.is_type_only_export;
        self.is_type_only_export = export.type_only;
        export.visit_children_with(self);
        self.is_type_only_export = old;
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(e) = n {
            e.visit_with(self)
        }
    }

    fn visit_stmts(&mut self, n: &[Stmt]) {
        let old = self.non_top_level;
        self.non_top_level = true;
        n.iter().for_each(|n| n.visit_with(self));
        self.non_top_level = old;
    }

    fn visit_expr(&mut self, n: &Expr) {
        let old = self.in_var_pat;
        self.in_var_pat = false;
        n.visit_children_with(self);
        self.in_var_pat = old;
    }

    fn visit_ts_entity_name(&mut self, _: &TsEntityName) {}

    // these may contain expr
    fn visit_ts_expr_with_type_args(&mut self, _: &TsExprWithTypeArgs) {}

    fn visit_ts_type_element(&mut self, _: &TsTypeElement) {}

    fn visit_class(&mut self, c: &Class) {
        c.decorators.visit_with(self);
        c.super_class.visit_with(self);
        c.body.visit_with(self);
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        match &n.module_ref {
            TsModuleRef::TsEntityName(name) => {
                let entry = self
                    .scope
                    .referenced_idents
                    .entry(n.id.to_id())
                    .or_default();
                let mut name = name;
                loop {
                    match name {
                        TsEntityName::Ident(ref i) => {
                            entry.maybe_dependency = Some(i.clone());
                            break;
                        }
                        TsEntityName::TsQualifiedName(ref q) => name = &q.left,
                    }
                }
            }
            _ => {
                n.visit_children_with(self);
            }
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

impl<C> VisitMut for Strip<C>
where
    C: Comments,
{
    type_to_none!(visit_mut_opt_ts_type, Box<TsType>);

    type_to_none!(visit_mut_opt_ts_type_ann, TsTypeAnn);

    type_to_none!(visit_mut_opt_ts_type_param_decl, TsTypeParamDecl);

    type_to_none!(
        visit_mut_opt_ts_type_param_instantiation,
        TsTypeParamInstantiation
    );

    fn visit_mut_array_pat(&mut self, n: &mut ArrayPat) {
        n.visit_mut_children_with(self);
        n.optional = false;
    }

    // TODO: review this after https://github.com/microsoft/TypeScript/issues/45995
    // is resolved
    fn visit_mut_class(&mut self, class: &mut Class) {
        enum PropInit<'a> {
            Public(&'a mut PropName, &'a mut Option<Box<Expr>>),
            Private(&'a PrivateName, &'a mut Option<Box<Expr>>),
        }
        let mut prop_init = Vec::new();
        let mut constructor = None;
        for member in class.body.iter_mut() {
            match member {
                ClassMember::Constructor(c @ Constructor { body: Some(..), .. })
                    if c.params.iter().any(|param| param.is_ts_param_prop()) =>
                {
                    constructor = Some(c)
                }

                ClassMember::ClassProp(ClassProp {
                    declare: false,
                    is_abstract: false,
                    is_static: false,
                    value: value @ Some(..),
                    key,
                    ..
                }) => prop_init.push(PropInit::Public(key, value)),
                ClassMember::PrivateProp(PrivateProp {
                    is_static: false,
                    value: value @ Some(..),
                    key,
                    ..
                }) => prop_init.push(PropInit::Private(key, value)),

                _ => (),
            }
        }
        if let Some(c) = constructor {
            let mut assign_exprs = vec![];
            let mut extra_props = vec![];

            c.params.map_with_mut(|params| {
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
                                            left: i.into(),
                                            right,
                                            type_ann: None,
                                        }),
                                    },
                                )
                            }
                            _ => unreachable!("destructuring pattern inside TsParameterProperty"),
                        };
                        if self.config.use_define_for_class_fields {
                            extra_props.push(ident.id.clone());
                        }
                        let assign_expr = Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Expr(Box::new(
                                ThisExpr { span: DUMMY_SP }.make_member(ident.id.clone()),
                            )),
                            op: op!("="),
                            right: Box::new(Expr::Ident(ident.id)),
                        }));
                        assign_exprs.push(assign_expr);

                        ParamOrTsParamProp::Param(param)
                    }
                })
            });

            assign_exprs.extend(prop_init.into_iter().map(|prop| {
                let this = Box::new(Expr::This(ThisExpr { span: DUMMY_SP }));
                match prop {
                    PropInit::Private(key, value) => {
                        let value = value.take().unwrap();
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Expr(
                                Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: this,
                                    prop: MemberProp::PrivateName(key.clone()),
                                })
                                .into(),
                            ),
                            op: op!("="),
                            right: value,
                        }))
                    }
                    PropInit::Public(key, value) => {
                        let value = value.take().unwrap();
                        let key = match key {
                            PropName::Computed(ComputedPropName { span: c_span, expr })
                                if !is_literal(&*expr) =>
                            {
                                let ident = alias_ident_for(&*expr, "_key");
                                // Handle computed property
                                self.keys.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: Some(expr.take()),
                                    definite: false,
                                });
                                // We use computed because `classes` pass converts PropName::Ident
                                // to string.
                                **expr = Expr::Ident(ident.clone());
                                PropName::Computed(ComputedPropName {
                                    span: *c_span,
                                    expr: Box::new(Expr::Ident(ident)),
                                })
                            }
                            _ => key.clone(),
                        };
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Expr(
                                Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: this,
                                    prop: if let PropName::Ident(id) = key {
                                        MemberProp::Ident(id)
                                    } else {
                                        MemberProp::Computed(ComputedPropName {
                                            span: key.span(),
                                            expr: prop_name_to_expr(key).into(),
                                        })
                                    },
                                })
                                .into(),
                            ),
                            op: op!("="),
                            right: value,
                        }))
                    }
                }
            }));

            inject_after_super(c, assign_exprs);

            if !extra_props.is_empty() {
                class.body.extend(extra_props.into_iter().map(|prop| {
                    ClassMember::ClassProp(ClassProp {
                        key: PropName::Ident(prop),
                        value: None,
                        decorators: Vec::new(),
                        is_static: false,
                        type_ann: None,
                        span: DUMMY_SP,
                        accessibility: None,
                        is_abstract: false,
                        is_optional: false,
                        is_override: false,
                        readonly: false,
                        declare: false,
                        definite: false,
                    })
                }))
            }
        }

        class.is_abstract = false;
        class.type_params = None;
        class.super_type_params = None;
        class.implements = Default::default();
        class.visit_mut_children_with(self)
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
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
            ClassMember::PrivateMethod(PrivateMethod {
                is_abstract: true, ..
            })
            | ClassMember::PrivateMethod(PrivateMethod {
                function: Function { body: None, .. },
                ..
            }) => false,
            ClassMember::ClassProp(ClassProp { declare: true, .. }) => false,
            ClassMember::ClassProp(ClassProp {
                value: None,
                ref decorators,
                ..
            }) if decorators.is_empty() && !self.config.use_define_for_class_fields => false,

            _ => true,
        });

        members.visit_mut_children_with(self);
    }

    fn visit_mut_class_prop(&mut self, prop: &mut ClassProp) {
        prop.visit_mut_children_with(self);
        prop.readonly = false;
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
    }

    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        self.is_side_effect_import = import.specifiers.is_empty();

        import.specifiers.retain(|s| match *s {
            ImportSpecifier::Named(ImportNamedSpecifier {
                ref is_type_only, ..
            }) if *is_type_only => false,

            ImportSpecifier::Default(ImportDefaultSpecifier { ref local, .. })
            | ImportSpecifier::Named(ImportNamedSpecifier { ref local, .. })
            | ImportSpecifier::Namespace(ImportStarAsSpecifier { ref local, .. }) => {
                if let Some(jsx) = &self.jsx {
                    if local.sym == jsx.pragma_id.0 || local.sym == jsx.pragma_frag_id.0 {
                        return true;
                    }
                }

                // If the import is shadowed by a concrete local declaration, TSC
                // assumes the import is a type and removes it.
                let decl = self.scope.decls.get(&local.to_id());
                if let Some(&DeclInfo {
                    has_concrete: true, ..
                }) = decl
                {
                    return false;
                }
                // If no shadowed declaration, check if the import is referenced.
                let entry = self.scope.referenced_idents.get(&local.to_id());
                !matches!(
                    entry,
                    Some(&DeclInfo {
                        has_concrete: false,
                        ..
                    })
                )
            }
        });

        if import.specifiers.is_empty() && !self.is_side_effect_import {
            self.is_side_effect_import = match self.config.import_not_used_as_values {
                ImportsNotUsedAsValues::Remove => false,
                ImportsNotUsedAsValues::Preserve => true,
            };
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        let was_module = module
            .body
            .iter()
            .any(|item| matches!(item, ModuleItem::ModuleDecl(..)));

        self.parse_jsx_directives(module.span);

        for item in &module.body {
            let span = item.span();
            if self.parse_jsx_directives(span) {
                break;
            }
        }

        module.visit_mut_children_with(self);
        if !self.uninitialized_vars.is_empty() {
            prepend_stmt(
                &mut module.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.uninitialized_vars),
                    declare: false,
                }))
                .into(),
            );
        }

        let is_module = module
            .body
            .iter()
            .any(|item| matches!(item, ModuleItem::ModuleDecl(..)));

        // Create `export {}` to preserve module context, just like tsc.
        //
        // See https://github.com/swc-project/swc/issues/1698
        if was_module
            && !is_module
            && !self.config.no_empty_export
            && module.body.iter().all(|item| match item {
                ModuleItem::ModuleDecl(_) => false,
                ModuleItem::Stmt(_) => true,
            })
        {
            module
                .body
                .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    NamedExport {
                        span: module.span,
                        specifiers: vec![],
                        src: None,
                        type_only: false,
                        asserts: None,
                    },
                )))
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let orig_keys = self.keys.take();
        items.visit_with(self);

        let mut stmts = Vec::with_capacity(items.len());
        for mut item in take(items) {
            self.is_side_effect_import = false;
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl: Decl::TsModule(module),
                    ..
                })) => {
                    let (decl, init) = match self.handle_ts_module(module, None) {
                        Some(v) => v,
                        None => continue,
                    };

                    stmts.extend(decl.map(|decl| {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { span, decl }))
                    }));
                    stmts.push(init.into())
                }

                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(module))) => {
                    let (decl, init) = match self.handle_ts_module(module, None) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.extend(decl.map(Stmt::Decl).map(ModuleItem::Stmt));
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

                ModuleItem::Stmt(Stmt::Decl(Decl::Class(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(..),
                    ..
                }))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl: DefaultDecl::Class(..),
                    ..
                })) => {
                    item.visit_mut_children_with(self);
                    if !self.keys.is_empty() {
                        stmts.push(
                            Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                declare: false,
                                decls: self.keys.take(),
                                kind: VarDeclKind::Let,
                            }))
                            .into(),
                        )
                    }

                    stmts.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(TsImportEqualsDecl {
                    span,
                    declare: false,
                    is_export: false,
                    is_type_only: false,
                    id,
                    module_ref:
                        TsModuleRef::TsExternalModuleRef(TsExternalModuleRef { span: _, expr }),
                })) => {
                    let default = VarDeclarator {
                        span: DUMMY_SP,
                        name: id.into(),
                        init: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("require").as_callee(),
                            args: vec![expr.as_arg()],
                            type_args: None,
                        }))),
                        definite: false,
                    };
                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![default],
                    }))))
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
                    let (decl, init) = self.handle_enum(e, None);
                    stmts.extend(decl.map(|decl| {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: DUMMY_SP,
                            decl,
                        }))
                    }));
                    stmts.push(ModuleItem::Stmt(init));
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(e))) => {
                    let (decl, init) = self.handle_enum(e, None);
                    stmts.extend(decl.map(|decl| ModuleItem::Stmt(Stmt::Decl(decl))));
                    stmts.push(ModuleItem::Stmt(init));
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
                    let maybe_entry = self.scope.referenced_idents.get(&import.id.to_id());
                    let has_concrete = if let Some(entry) = maybe_entry {
                        entry.has_concrete
                    } else {
                        true
                    };
                    // TODO(nayeemrmn): For some reason TSC preserves `import foo = bar.baz`
                    // when `bar.baz` is not defined, even if `foo` goes unused. We can't currently
                    // identify that case so we strip it anyway.
                    if !import.is_type_only && (has_concrete || import.is_export) {
                        let var = Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: import.id.into(),
                                init: Some(Box::new(module_ref_to_expr(import.module_ref))),
                                definite: false,
                            }],
                            declare: false,
                        });
                        if import.is_export {
                            stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                                ExportDecl {
                                    span: DUMMY_SP,
                                    decl: var,
                                },
                            )));
                        } else {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(var)));
                        }
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(mut export)) => {
                    export.expr.visit_mut_with(self);

                    stmts.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: export.span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: export.span,
                            left: PatOrExpr::Expr(member_expr!(DUMMY_SP, module.exports)),
                            op: op!("="),
                            right: export.expr,
                        })),
                    })));
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // if specifier become empty, we remove export statement.

                    if export.type_only {
                        export.specifiers.clear();
                    }
                    export.specifiers.retain(|s| match *s {
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            ref orig,
                            ref is_type_only,
                            ..
                        }) => {
                            let orig_ident = match orig {
                                ModuleExportName::Ident(ident) => ident,
                                ModuleExportName::Str(..) => return true,
                            };
                            if *is_type_only {
                                false
                            } else if let Some(e) = self.scope.decls.get(&orig_ident.to_id()) {
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

        if !self.keys.is_empty() {
            prepend_stmt(
                &mut stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    decls: self.keys.take(),
                    kind: VarDeclKind::Let,
                }))
                .into(),
            )
        }

        self.keys = orig_keys;

        *items = stmts;
        *items = self.handle_module_items(take(items), None);
    }

    fn visit_mut_object_pat(&mut self, pat: &mut ObjectPat) {
        pat.visit_mut_children_with(self);
        pat.optional = false;
    }

    fn visit_mut_opt_accessibility(&mut self, n: &mut Option<Accessibility>) {
        *n = None;
    }

    /// Remove `this` from parameter list
    fn visit_mut_params(&mut self, params: &mut Vec<Param>) {
        params.visit_mut_children_with(self);

        params.retain(|param| {
            !matches!(
                param.pat,
                Pat::Ident(BindingIdent {
                    id: Ident {
                        sym: js_word!("this"),
                        ..
                    },
                    ..
                })
            )
        });
    }

    fn visit_mut_pat_or_expr(&mut self, node: &mut PatOrExpr) {
        // Coerce bindingident to assign expr where parenthesis exists due to TsAsExpr
        // like (warn as any) = v;
        // We want to do this _before_ visiting children, otherwise handle_expr
        // wipes out TsAsExpr and there's no way to distinguish between
        // plain (x) = y vs. (x as any) = y;
        if let PatOrExpr::Pat(pat) = node {
            if let Pat::Expr(expr) = &**pat {
                if let Expr::Paren(ParenExpr { expr, .. }) = &**expr {
                    if let Expr::TsAs(TsAsExpr { expr, .. }) = &**expr {
                        if let Expr::Ident(ident) = &**expr {
                            *node = PatOrExpr::Pat(ident.clone().into());
                        }
                    }
                }
            }
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_private_prop(&mut self, prop: &mut PrivateProp) {
        prop.visit_mut_children_with(self);
        prop.readonly = false;
        prop.definite = false;
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.parse_jsx_directives(n.span);

        for item in &n.body {
            let span = item.span();
            if self.parse_jsx_directives(span) {
                break;
            }
        }

        n.visit_mut_children_with(self);

        if !self.uninitialized_vars.is_empty() {
            prepend_stmt(
                &mut n.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.uninitialized_vars),
                    declare: false,
                })),
            );
        }
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        stmt.visit_mut_children_with(self);

        if let Stmt::Decl(ref decl) = stmt {
            match decl {
                Decl::TsInterface(..)
                | Decl::TsTypeAlias(..)
                | Decl::Var(VarDecl { declare: true, .. })
                | Decl::Class(ClassDecl { declare: true, .. })
                | Decl::Fn(FnDecl { declare: true, .. }) => {
                    *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP })
                }

                _ => {}
            }
        }
    }

    fn visit_mut_stmts(&mut self, orig: &mut Vec<Stmt>) {
        let orig_keys = self.keys.take();

        let mut stmts = Vec::with_capacity(orig.len());
        for mut item in take(orig) {
            self.is_side_effect_import = false;
            match item {
                Stmt::Empty(..) => continue,

                Stmt::Decl(Decl::TsModule(module)) => {
                    let (decl, init) = match self.handle_ts_module(module, None) {
                        Some(v) => v,
                        None => continue,
                    };
                    stmts.extend(decl.map(Stmt::Decl));
                    stmts.push(init)
                }

                Stmt::Decl(Decl::TsEnum(e)) => {
                    let (decl, init) = self.handle_enum(e, None);
                    stmts.extend(decl.map(Stmt::Decl));
                    stmts.push(init);
                }

                // Strip out ts-only extensions
                Stmt::Decl(Decl::Fn(FnDecl {
                    function: Function { body: None, .. },
                    ..
                }))
                | Stmt::Decl(Decl::TsTypeAlias(..)) => continue,

                Stmt::Decl(Decl::Class(mut class)) => {
                    class.visit_mut_with(self);
                    if !self.keys.is_empty() {
                        stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            declare: false,
                            decls: self.keys.take(),
                            kind: VarDeclKind::Let,
                        })))
                    }

                    stmts.push(Stmt::Decl(Decl::Class(class)));
                }

                _ => {
                    item.visit_mut_with(self);
                    stmts.push(item);
                }
            };
        }

        if !self.keys.is_empty() {
            prepend_stmt(
                &mut stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    decls: self.keys.take(),
                    kind: VarDeclKind::Let,
                })),
            )
        }

        self.keys = orig_keys;

        *orig = stmts
    }

    fn visit_mut_ts_interface_decl(&mut self, n: &mut TsInterfaceDecl) {
        n.type_params = None;
    }

    fn visit_mut_ts_type_alias_decl(&mut self, node: &mut TsTypeAliasDecl) {
        node.type_params = None;
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
                obj: Box::new(ts_entity_name_to_expr(left)),
                prop: MemberProp::Ident(right),
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
            obj: Box::new(Expr::Ident(obj.clone())),
            prop: MemberProp::Ident(i.id),
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
                    ObjectPatProp::Assign(assign) => ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(assign.key.clone()),
                        value: Box::new(Pat::Expr(Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(obj.clone())),
                            prop: MemberProp::Ident(assign.key),
                        })))),
                    }),
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

struct EnumValuesVisitor<'a> {
    ident: &'a Ident,
    previous: &'a EnumValues,
}
impl VisitMut for EnumValuesVisitor<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(ident) if self.previous.contains_key(&ident.sym) => {
                *expr = self.ident.clone().make_member(ident.clone());
            }
            Expr::Member(MemberExpr {
                obj,
                // prop,
                ..
            }) => {
                if let Expr::Ident(ident) = &**obj {
                    if self.previous.get(&ident.sym).is_some() {
                        **obj = self.ident.clone().make_member(ident.clone());
                    }
                }
            }
            _ => expr.visit_mut_children_with(self),
        }
    }
}
