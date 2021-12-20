use serde::{Deserialize, Serialize};
use std::mem::take;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    comments::{Comments, NoopComments},
    sync::Lrc,
    util::{move_map::MoveMap, take::Take},
    Mark, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_react::{parse_expr_for_jsx, JsxDirectives};
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, ident::IdentLike, member_expr, prepend,
    private_ident, prop_name_to_expr, quote_ident, replace_ident, var::VarCollector, ExprFactory,
    Id, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{as_folder, Fold, Visit, VisitMut, VisitMutWith, VisitWith};

/// Value does not contain TsLit::Bool
type EnumValues = AHashMap<JsWord, TsLit>;

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
}

pub fn strip_with_config(config: Config, top_level_mark: Mark) -> impl Fold + VisitMut {
    as_folder(Strip {
        config,
        comments: NoopComments,
        jsx: None,
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        non_top_level: Default::default(),
        scope: Default::default(),
        is_side_effect_import: Default::default(),
        is_type_only_export: Default::default(),
        uninitialized_vars: Default::default(),
        decl_names: Default::default(),
        in_var_pat: Default::default(),
    })
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
        non_top_level: Default::default(),
        scope: Default::default(),
        is_side_effect_import: Default::default(),
        is_type_only_export: Default::default(),
        uninitialized_vars: Default::default(),
        decl_names: Default::default(),
        in_var_pat: Default::default(),
    })
}

/// Get an [Id] which will used by expression.
///
/// For `React#1.createElemnnt`, this returns `React#1`.
fn id_for_jsx(e: &Expr) -> Id {
    match e {
        Expr::Ident(i) => i.to_id(),
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            ..
        }) => id_for_jsx(&obj),
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
            name: Pat::Ident(BindingIdent {
                id: Ident::new(name.0, DUMMY_SP.with_ctxt(name.1)),
                type_ann: None,
            }),
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
    /// interface / type alias
    has_type: bool,
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
    fn fold_class_as_decl(
        &mut self,
        ident: Ident,
        orig_ident: Option<Ident>,
        mut class: Class,
    ) -> (Decl, Vec<Box<Expr>>) {
        class.is_abstract = false;
        class.type_params = None;
        class.super_type_params = None;
        class.implements = Default::default();

        class.body.retain(|c| match c {
            ClassMember::Constructor(Constructor { body: None, .. }) => false,
            ClassMember::ClassProp(ClassProp { declare: true, .. }) => false,
            _ => true,
        });

        let mut extra_exprs = vec![];
        if self.config.use_define_for_class_fields {
            let mut param_class_fields = vec![];
            for member in &class.body {
                match member {
                    ClassMember::Constructor(constructor) => {
                        for param in &constructor.params {
                            match param {
                                ParamOrTsParamProp::TsParamProp(param_prop) => {
                                    let ident = match &param_prop.param {
                                        TsParamPropParam::Ident(ident) => ident.id.clone(),
                                        TsParamPropParam::Assign(pat) => {
                                            pat.clone().left.ident().unwrap().id
                                        }
                                    };
                                    let param_class_field = ClassMember::ClassProp(ClassProp {
                                        span: class.span,
                                        key: PropName::Ident(ident),
                                        value: None,
                                        type_ann: None,
                                        is_static: false,
                                        decorators: param_prop.decorators.clone(),
                                        accessibility: param_prop.accessibility.clone(),
                                        is_abstract: false,
                                        is_optional: false,
                                        is_override: param_prop.is_override,
                                        readonly: param_prop.readonly,
                                        declare: false,
                                        definite: false,
                                    });
                                    param_class_fields.push(param_class_field);
                                }
                                _ => {}
                            }
                        }
                        break;
                    }
                    _ => {}
                }
            }
            if !param_class_fields.is_empty() {
                param_class_fields.append(&mut class.body.take());
                class.body = param_class_fields;
            }
        } else {
            for m in class.body.iter_mut() {
                match m {
                    ClassMember::ClassProp(m) => {
                        if let Some(orig_ident) = &orig_ident {
                            replace_ident(&mut m.value, orig_ident.to_id(), &ident)
                        }
                    }
                    _ => {}
                }
            }

            let mut key_computations = vec![];
            let mut assign_exprs = vec![];
            let mut new_body = vec![];
            for member in take(&mut class.body) {
                match member {
                    ClassMember::ClassProp(mut class_field)
                        if !class_field.is_static && class_field.decorators.is_empty() =>
                    {
                        if let Some(value) = class_field.value.take() {
                            let computed = match &mut class_field.key {
                                PropName::Computed(key) => {
                                    let ident = private_ident!("_key");
                                    self.uninitialized_vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(ident.clone().into()),
                                        init: None,
                                        definite: false,
                                    });
                                    let assign_lhs =
                                        PatOrExpr::Expr(Box::new(Expr::Ident(ident.clone())));
                                    let assign_expr = Box::new(Expr::Assign(AssignExpr {
                                        span: class_field.span,
                                        op: op!("="),
                                        left: assign_lhs,
                                        right: key.expr.take(),
                                    }));
                                    key_computations.push(assign_expr);
                                    class_field.key = PropName::Ident(ident);
                                    true
                                }
                                PropName::Ident(..) => false,
                                PropName::Str(..) | PropName::Num(..) | PropName::BigInt(..) => {
                                    true
                                }
                            };
                            let assign_lhs = PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                span: class_field.span,
                                obj: ExprOrSuper::Expr(Box::new(Expr::This(ThisExpr {
                                    span: class.span,
                                }))),
                                prop: prop_name_to_expr(class_field.key).into(),
                                computed,
                            })));
                            let assign_expr = Box::new(Expr::Assign(AssignExpr {
                                span: class_field.span,
                                op: op!("="),
                                left: assign_lhs,
                                right: value,
                            }));
                            assign_exprs.push(assign_expr);
                        }
                    }
                    ClassMember::ClassProp(mut class_field)
                        if class_field.is_static && class_field.decorators.is_empty() =>
                    {
                        if let Some(value) = class_field.value.take() {
                            let computed = match &mut class_field.key {
                                PropName::Computed(key) => {
                                    let ident = private_ident!("_key");
                                    self.uninitialized_vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(ident.clone().into()),
                                        init: None,
                                        definite: false,
                                    });
                                    let assign_lhs =
                                        PatOrExpr::Expr(Box::new(Expr::Ident(ident.clone())));
                                    let assign_expr = Box::new(Expr::Assign(AssignExpr {
                                        span: class_field.span,
                                        op: op!("="),
                                        left: assign_lhs,
                                        right: key.expr.take(),
                                    }));
                                    key_computations.push(assign_expr);
                                    class_field.key = PropName::Ident(ident);
                                    true
                                }
                                PropName::Ident(..) => false,
                                PropName::Str(..) | PropName::Num(..) | PropName::BigInt(..) => {
                                    true
                                }
                            };
                            let assign_lhs = PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: ident.clone().as_obj(),
                                prop: prop_name_to_expr(class_field.key).into(),
                                computed,
                            })));
                            extra_exprs.push(Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: assign_lhs,
                                right: value,
                            })));
                        }
                    }
                    ClassMember::Method(mut method) => {
                        if !key_computations.is_empty() {
                            match &mut method.key {
                                PropName::Computed(name) => {
                                    // If a computed method name is encountered, dump the other key
                                    // assignments before it in a sequence expression. Note how this
                                    // always preserves the order of key computations. This
                                    // behavior is taken from TSC output.
                                    key_computations.push(name.expr.take());
                                    name.expr = Box::new(Expr::Seq(SeqExpr {
                                        span: name.span,
                                        exprs: take(&mut key_computations),
                                    }));
                                }
                                _ => {}
                            }
                        }
                        new_body.push(ClassMember::Method(method));
                    }
                    _ => {
                        new_body.push(member);
                    }
                }
            }
            if !assign_exprs.is_empty() {
                for member in &mut new_body {
                    match member {
                        ClassMember::Constructor(constructor) => {
                            inject_after_super(constructor, take(&mut assign_exprs));
                            break;
                        }
                        _ => {}
                    }
                }
                if !assign_exprs.is_empty() {
                    let mut constructor = default_constructor(class.super_class.is_some());
                    inject_after_super(&mut constructor, assign_exprs);
                    new_body.push(ClassMember::Constructor(constructor));
                }
            }
            class.body = new_body;
            key_computations.append(&mut extra_exprs);
            extra_exprs = key_computations;
        }

        class.decorators.visit_mut_with(self);
        class.body.visit_mut_with(self);
        class.super_class.visit_mut_with(self);
        extra_exprs.visit_mut_with(self);
        (
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class,
            }),
            extra_exprs,
        )
    }

    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self>,
    {
        for stmt in take(stmts) {
            match T::try_into_stmt(stmt) {
                Ok(stmt) => match stmt {
                    Stmt::Decl(Decl::Class(ClassDecl {
                        ident,
                        declare: false,
                        class,
                    })) => {
                        let orig_ident = ident.clone();
                        let (decl, extra_exprs) =
                            self.fold_class_as_decl(ident, Some(orig_ident), class);
                        stmts.push(T::from_stmt(Stmt::Decl(decl)));
                        stmts.extend(extra_exprs.into_iter().map(|e| T::from_stmt(e.into_stmt())));
                    }
                    _ => stmts.push(T::from_stmt(stmt)),
                },
                Err(node) => match node.try_into_module_decl() {
                    Ok(decl) => match decl {
                        ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                            span,
                            decl: DefaultDecl::Class(ClassExpr { ident, class }),
                            ..
                        }) => {
                            let orig_ident = ident.clone();
                            let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                            let (decl, extra_exprs) =
                                self.fold_class_as_decl(ident.clone(), orig_ident, class);
                            stmts.push(T::from_stmt(Stmt::Decl(decl)));
                            stmts.extend(
                                extra_exprs.into_iter().map(|e| T::from_stmt(e.into_stmt())),
                            );
                            stmts.push(
                                match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                    NamedExport {
                                        span,
                                        specifiers: vec![ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: ident,
                                            exported: Some(Ident::new(
                                                js_word!("default"),
                                                DUMMY_SP,
                                            )),
                                            is_type_only: false,
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
                            let orig_ident = ident.clone();
                            let (decl, extra_exprs) =
                                self.fold_class_as_decl(ident, Some(orig_ident), class);
                            stmts.push(
                                match T::try_from_module_decl(ModuleDecl::ExportDecl(ExportDecl {
                                    span,
                                    decl,
                                })) {
                                    Ok(t) => t,
                                    Err(..) => unreachable!(),
                                },
                            );
                            stmts.extend(
                                extra_exprs.into_iter().map(|e| T::from_stmt(e.into_stmt())),
                            );
                        }
                        _ => stmts.push(match T::try_from_module_decl(decl) {
                            Ok(t) => t,
                            Err(..) => unreachable!(),
                        }),
                    },
                    Err(_) => unreachable!(),
                },
            }
        }
    }

    /// Returns [Some] if the method should be called again.
    fn handle_expr<'a>(&mut self, n: &'a mut Expr) -> Vec<&'a mut Expr> {
        if n.is_class() {
            let ClassExpr {
                ident: old_ident,
                class,
            } = n.take().class().unwrap();
            let ident = private_ident!("_class");
            let (decl, extra_exprs) =
                self.fold_class_as_decl(ident.clone(), old_ident.clone(), class);
            let class_expr = Box::new(Expr::Class(ClassExpr {
                ident: old_ident,
                class: decl.class().unwrap().class,
            }));
            if extra_exprs.is_empty() {
                *n = *class_expr;
            } else {
                self.uninitialized_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ident.clone().into()),
                    init: None,
                    definite: false,
                });
                let assign_lhs = PatOrExpr::Pat(Box::new(Pat::Ident(BindingIdent {
                    id: ident.clone(),
                    type_ann: None,
                })));
                let assign_expr = Box::new(Expr::Assign(AssignExpr {
                    span: n.span(),
                    op: op!("="),
                    left: assign_lhs,
                    right: class_expr,
                }));
                let mut exprs = vec![];
                exprs.push(assign_expr);
                exprs.extend(extra_exprs);
                exprs.push(Box::new(Expr::Ident(ident)));
                *n = Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                });
            }
            return vec![];
        }
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
                        if let Some(v) = values.get(&id.sym) {
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
                            default = n.value as i64 + 1;
                        }
                        _ => {}
                    }
                    values.insert(
                        match &m.id {
                            TsEnumMemberId::Ident(i) => i.sym.clone(),
                            TsEnumMemberId::Str(s) => s.value.clone(),
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
                                        left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                            span: DUMMY_SP,
                                            obj: id.clone().as_obj(),
                                            prop: Box::new(Expr::Lit(Lit::Str(value.clone()))),
                                            computed: true,
                                        }))),
                                        op: op!("="),
                                        right: Box::new(val.clone()),
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
                                        if m.init.is_some() {
                                            Box::new(val)
                                        } else {
                                            Box::new(Expr::Lit(Lit::Str(value.clone())))
                                        }
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
        let var = self.create_uninit_var(module_name.span, module_name.to_id());
        let private_name = private_ident!(module_name.sym.clone());
        let body_stmts = match body {
            TsNamespaceBody::TsModuleBlock(block) => {
                self.handle_ts_module_block(block, &private_name)
            }
            TsNamespaceBody::TsNamespaceDecl(decl) => {
                self.handle_ts_namespace_decl(decl, &private_name)
            }
        }?;

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
            name: Pat::Ident(BindingIdent {
                id: var_id.clone(),
                type_ann: None,
            }),
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
                    pat: Pat::Ident(private_name.clone().into()),
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
        mut items: Vec<ModuleItem>,
        parent_module_name: Option<&Ident>,
    ) -> Vec<ModuleItem> {
        let mut delayed_vars = vec![];

        self.visit_mut_stmt_like(&mut items);
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
                        name: Pat::Ident(id.into()),
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
                                name: Pat::Ident(import.id.clone().into()),
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
                            if *is_type_only {
                                false
                            } else if let Some(e) = self.scope.decls.get(&orig.to_id()) {
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
                                match &decl.name {
                                    Pat::Ident(name) => {
                                        delayed_vars.push(name.id.clone());
                                        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(
                                            VarDecl {
                                                span: DUMMY_SP,
                                                kind: v.kind,
                                                declare: false,
                                                decls: vec![decl],
                                            },
                                        ))));
                                    }
                                    _ => {}
                                }

                                continue;
                            }
                        };
                        match decl.name {
                            Pat::Ident(name) => {
                                //
                                let left = PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: parent_module_name.clone().as_obj(),
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
                                let pat = Box::new(create_prop_pat(&parent_module_name, decl.name));
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
                                    obj: parent_module_name.unwrap().clone().as_obj(),
                                    prop: Box::new(Expr::Ident(prop)),
                                    computed: false,
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
                computed: false,
                obj: ExprOrSuper::Expr(Box::new(Expr::Ident(module_name.clone()))),
                prop: Box::new(Expr::Ident(Ident::new(
                    id.sym.clone(),
                    DUMMY_SP.with_ctxt(decl_span.ctxt),
                ))),
            }));
            AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Pat::Ident(id.clone().into()).into()),
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
                    left: PatOrExpr::Pat(Pat::Ident(id.clone().into()).into()),
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
            obj: module_name.clone().as_obj(),
            prop: Box::new(Expr::Ident(decl_name.clone())),
            computed: false,
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
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        if !self.in_var_pat {
            n.key.visit_with(self);
        }
        n.value.visit_with(self);
    }

    fn visit_assign_prop(&mut self, n: &AssignProp) {
        n.value.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        if !self.in_var_pat {
            n.visit_children_with(self)
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
                for decl in &var.decls {
                    self.in_var_pat = true;
                    decl.name.visit_with(self);
                    self.in_var_pat = false;
                    decl.init.visit_with(self);
                }
            }
            Decl::TsEnum(e) => {
                e.members.visit_with(self);
            }
            Decl::TsInterface(interface) => {
                interface.extends.visit_with(self);
                interface.body.visit_with(self);
            }
            Decl::TsModule(module) => {
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
        if self.is_type_only_export {
            entry.has_type = true;
        } else {
            entry.has_concrete = true;
        }
        if let Some(i) = &entry.maybe_dependency {
            let id = i.to_id();
            if let Some(entry) = self.scope.referenced_idents.get_mut(&id) {
                if self.is_type_only_export {
                    entry.has_type = true;
                } else {
                    entry.has_concrete = true;
                }
            }
        }
        n.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        macro_rules! store {
            ($i:expr) => {{
                self.scope
                    .referenced_idents
                    .entry(($i.sym.clone(), $i.span.ctxt()))
                    .or_default();
                if n.type_only {
                    self.scope.decls.entry($i.to_id()).or_default().has_type = true;
                }
            }};
        }
        for s in &n.specifiers {
            match *s {
                ImportSpecifier::Default(ref import) => store!(import.local),
                ImportSpecifier::Named(ref import) => store!(import.local),
                ImportSpecifier::Namespace(ref import) => store!(import.local),
            }
        }
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        n.obj.visit_with(self);
        if n.computed {
            n.prop.visit_with(self);
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
        match n {
            PropName::Computed(e) => e.visit_with(self),
            _ => {}
        }
    }

    fn visit_stmts(&mut self, n: &[Stmt]) {
        let old = self.non_top_level;
        self.non_top_level = true;
        n.iter().for_each(|n| n.visit_with(self));
        self.non_top_level = old;
    }

    fn visit_ts_entity_name(&mut self, name: &TsEntityName) {
        match *name {
            TsEntityName::Ident(ref i) => {
                let entry = self.scope.referenced_idents.entry(i.to_id()).or_default();
                entry.has_type = true;
                if let Some(i) = &entry.maybe_dependency {
                    let id = i.to_id();
                    if let Some(entry) = self.scope.referenced_idents.get_mut(&id) {
                        entry.has_type = true;
                    }
                }
            }
            TsEntityName::TsQualifiedName(ref q) => q.left.visit_with(self),
        }
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
    fn visit_mut_block_stmt_or_expr(&mut self, n: &mut BlockStmtOrExpr) {
        match n {
            BlockStmtOrExpr::Expr(expr) if expr.is_class() => {
                let span = expr.span();

                let ClassExpr { ident, class } = expr.take().class().unwrap();
                let orig_ident = ident.clone();
                let ident = ident.unwrap_or_else(|| private_ident!("_class"));
                let (decl, extra_exprs) = self.fold_class_as_decl(ident.clone(), orig_ident, class);
                let mut stmts = vec![];
                stmts.push(Stmt::Decl(decl));
                stmts.extend(
                    extra_exprs
                        .into_iter()
                        .map(|e| e.into_stmt())
                        .collect::<Vec<_>>(),
                );
                stmts.push(Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(Box::new(Expr::Ident(ident))),
                }));
                *n = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: n.span(),
                    stmts,
                });
            }
            _ => n.visit_mut_children_with(self),
        };
    }

    fn visit_mut_array_pat(&mut self, n: &mut ArrayPat) {
        n.visit_mut_children_with(self);
        n.optional = false;
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.visit_mut_children_with(self);

        let mut assign_exprs = vec![];

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

        inject_after_super(n, assign_exprs);
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
                match decl {
                    Some(&DeclInfo {
                        has_concrete: true, ..
                    }) => return false,
                    _ => {}
                }
                // If no shadowed declaration, check if the import is referenced.
                let entry = self.scope.referenced_idents.get(&local.to_id());
                match entry {
                    Some(&DeclInfo {
                        has_concrete: false,
                        ..
                    }) => false,
                    _ => true,
                }
            }
        });

        if import.specifiers.is_empty() && !self.is_side_effect_import {
            self.is_side_effect_import = match self.config.import_not_used_as_values {
                ImportsNotUsedAsValues::Remove => false,
                ImportsNotUsedAsValues::Preserve => true,
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
        self.visit_mut_stmt_like(orig);
        // Second pass
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
            ClassMember::ClassProp(ClassProp {
                value: None,
                ref decorators,
                ..
            }) if decorators.is_empty() && !self.config.use_define_for_class_fields => false,

            _ => true,
        });

        members.visit_mut_children_with(self);
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

    fn visit_mut_module(&mut self, module: &mut Module) {
        let was_module = module.body.iter().any(|item| match item {
            ModuleItem::ModuleDecl(..) => true,
            _ => false,
        });

        self.parse_jsx_directives(module.span);

        for item in &module.body {
            let span = item.span();
            if self.parse_jsx_directives(span) {
                break;
            }
        }

        module.visit_mut_children_with(self);
        if !self.uninitialized_vars.is_empty() {
            prepend(
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

        let is_module = module.body.iter().any(|item| match item {
            ModuleItem::ModuleDecl(..) => true,
            _ => false,
        });

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
            prepend(
                &mut n.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.uninitialized_vars),
                    declare: false,
                }))
                .into(),
            );
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(items);
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
                        name: Pat::Ident(id.into()),
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
                                name: Pat::Ident(import.id.into()),
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
                            if *is_type_only {
                                false
                            } else if let Some(e) = self.scope.decls.get(&orig.to_id()) {
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
        *items = self.handle_module_items(take(items), None);
    }

    fn visit_mut_var_declarator(&mut self, d: &mut VarDeclarator) {
        d.visit_mut_children_with(self);
        d.definite = false;
    }

    fn visit_mut_pat_or_expr(&mut self, node: &mut PatOrExpr) {
        // Coerce bindingident to assign expr where parenthesis exists due to TsAsExpr
        // like (warn as any) = v;
        // We want to do this _before_ visiting children, otherwise handle_expr
        // wipes out TsAsExpr and there's no way to distinguish between
        // plain (x) = y vs. (x as any) = y;
        match node {
            PatOrExpr::Pat(pat) => match &**pat {
                Pat::Expr(expr) => match &**expr {
                    Expr::Paren(ParenExpr { expr, .. }) => match &**expr {
                        Expr::TsAs(TsAsExpr { expr, .. }) => match &**expr {
                            Expr::Ident(ident) => {
                                *node = PatOrExpr::Pat(Box::new(Pat::Ident(ident.clone().into())));
                            }
                            _ => (),
                        },
                        _ => (),
                    },
                    _ => (),
                },
                _ => (),
            },
            _ => (),
        }

        node.visit_mut_children_with(self);
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
                    ObjectPatProp::Assign(assign) => ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident(assign.key.clone()),
                        value: Box::new(Pat::Expr(Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: ExprOrSuper::Expr(Box::new(Expr::Ident(obj.clone()))),
                            prop: Box::new(Expr::Ident(assign.key.into())),
                            computed: false,
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
