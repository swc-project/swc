use std::{mem::take, sync::Arc};

use swc_atoms::Atom;
use swc_common::{util::take::Take, FileName, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    BindingIdent, ClassMember, Decl, DefaultDecl, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
    Expr, FnDecl, FnExpr, Ident, Lit, MethodKind, Module, ModuleDecl, ModuleItem, OptChainBase,
    Pat, Prop, PropName, PropOrSpread, Stmt, TsEntityName, TsFnOrConstructorType, TsFnParam,
    TsFnType, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsNamespaceBody,
    TsPropertySignature, TsTupleElement, TsTupleType, TsType, TsTypeAnn, TsTypeElement, TsTypeLit,
    TsTypeOperator, TsTypeOperatorOp, TsTypeRef, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::diagnostic::{DtsIssue, SourceRange};

/// TypeScript Isolated Declaration support.
///
/// ---
///
/// # License
///
/// Mostly copied from <https://github.com/denoland/deno_graph/blob/15db6e5fb6d3faea027e16c3d9ce6498b11beed2/src/fast_check/transform_dts.rs>
///
/// The original code is MIT licensed.

pub struct FastDts {
    filename: Arc<FileName>,
    is_top_level: bool,
    id_counter: u32,
    diagnostics: Vec<DtsIssue>,
}

/// Diagnostics
impl FastDts {
    pub fn new(filename: Arc<FileName>) -> Self {
        Self {
            filename,
            is_top_level: false,
            id_counter: 0,
            diagnostics: vec![],
        }
    }

    fn mark_diagnostic(&mut self, diagnostic: DtsIssue) {
        self.diagnostics.push(diagnostic)
    }

    fn source_range_to_range(&self, range: Span) -> SourceRange {
        SourceRange {
            filename: self.filename.clone(),
            span: range,
        }
    }

    fn mark_diagnostic_unable_to_infer(&mut self, range: Span) {
        self.mark_diagnostic(DtsIssue::UnableToInferType {
            range: self.source_range_to_range(range),
        })
    }

    fn mark_diagnostic_any_fallback(&mut self, range: Span) {
        self.mark_diagnostic(DtsIssue::UnableToInferTypeFallbackAny {
            range: self.source_range_to_range(range),
        })
    }

    fn mark_diagnostic_unsupported_prop(&mut self, range: Span) {
        self.mark_diagnostic(DtsIssue::UnableToInferTypeFromProp {
            range: self.source_range_to_range(range),
        })
    }
}

impl FastDts {
    pub fn transform(&mut self, module: &mut Module) -> Vec<DtsIssue> {
        self.is_top_level = true;

        self.transform_module_items(&mut module.body);

        take(&mut self.diagnostics)
    }

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let orig_items = take(items);
        let mut new_items = Vec::with_capacity(orig_items.len());

        let mut prev_is_overload = false;

        for mut item in orig_items {
            let is_overload = match &item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::Fn(FnDecl {
                        function, declare, ..
                    }) => !declare && function.body.is_none(),
                    _ => false,
                },

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl,
                    ..
                })) => {
                    matches!(decl, DefaultDecl::Fn(FnExpr { function, .. }) if function.body.is_none())
                }

                _ => false,
            };

            match &mut item {
                // Keep all these
                ModuleItem::ModuleDecl(
                    ModuleDecl::Import(..)
                    | ModuleDecl::TsImportEquals(_)
                    | ModuleDecl::TsNamespaceExport(_)
                    | ModuleDecl::TsExportAssignment(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::ExportAll(_),
                ) => new_items.push(item),

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span, decl, ..
                })) => {
                    let should_keep = prev_is_overload && !is_overload;

                    if should_keep {
                        prev_is_overload = is_overload;
                        continue;
                    }

                    if let Some(()) = self.decl_to_type_decl(decl) {
                        new_items.push(
                            ExportDecl {
                                decl: decl.take(),
                                span: *span,
                            }
                            .into()
                            .into(),
                        );
                    } else {
                        self.mark_diagnostic(DtsIssue::UnableToInferType {
                            range: self.source_range_to_range(*span),
                        })
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    match &mut export.decl {
                        DefaultDecl::Class(class_expr) => {
                            self.class_body_to_type(&mut class_expr.class.body);
                        }
                        DefaultDecl::Fn(fn_expr) => {
                            fn_expr.function.body = None;
                        }
                        DefaultDecl::TsInterfaceDecl(_) => {}
                    };

                    let should_keep = prev_is_overload && !is_overload;
                    prev_is_overload = is_overload;
                    if should_keep {
                        continue;
                    }

                    new_items.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                    let should_keep = prev_is_overload && !is_overload;
                    prev_is_overload = is_overload;
                    if should_keep {
                        continue;
                    }

                    let name = self.gen_unique_name();
                    let name_ident = Ident::new_no_ctxt(name, DUMMY_SP);
                    let type_ann = self
                        .expr_to_ts_type(export.expr.clone(), false, true)
                        .map(type_ann);

                    if let Some(type_ann) = type_ann {
                        new_items.push(
                            VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Const,
                                declare: true,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(BindingIdent {
                                        id: name_ident.clone(),

                                        type_ann: Some(type_ann),
                                    }),
                                    init: None,
                                    definite: false,
                                }],
                                ..Default::default()
                            }
                            .into()
                            .into()
                            .into(),
                        );

                        new_items.push(
                            ExportDefaultExpr {
                                span: export.span,
                                expr: name_ident.into(),
                            }
                            .into()
                            .into(),
                        )
                    } else {
                        new_items.push(
                            ExportDefaultExpr {
                                span: export.span,
                                expr: export.expr.take(),
                            }
                            .into()
                            .into(),
                        )
                    }
                }

                ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::TsEnum(_)
                    | Decl::Class(_)
                    | Decl::Fn(_)
                    | Decl::Var(_)
                    | Decl::TsModule(_) => {
                        if let Some(()) = self.decl_to_type_decl(decl) {
                            new_items.push(item);
                        } else {
                            self.mark_diagnostic_unable_to_infer(decl.span())
                        }
                    }

                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::Using(_) => {
                        new_items.push(item);
                    }
                },

                ModuleItem::Stmt(..) => {}
            }

            prev_is_overload = is_overload;
        }

        *items = new_items;
    }

    fn expr_to_ts_type(
        &mut self,
        e: Box<Expr>,
        as_const: bool,
        as_readonly: bool,
    ) -> Option<Box<TsType>> {
        match *e {
            Expr::Array(arr) => {
                let mut elem_types: Vec<TsTupleElement> = vec![];

                for elems in arr.elems {
                    if let Some(expr_or_spread) = elems {
                        let span = expr_or_spread.span();
                        if let Some(ts_expr) =
                            self.expr_to_ts_type(expr_or_spread.expr, as_const, as_readonly)
                        {
                            elem_types.push(ts_tuple_element(ts_expr));
                        } else {
                            self.mark_diagnostic_unable_to_infer(span);
                        }
                    } else {
                        // TypeScript converts holey arrays to any
                        // Example: const a = [,,] -> const a = [any, any, any]
                        elem_types.push(ts_tuple_element(Box::new(TsType::TsKeywordType(
                            TsKeywordType {
                                kind: TsKeywordTypeKind::TsAnyKeyword,
                                span: DUMMY_SP,
                            },
                        ))))
                    }
                }

                let mut result = Box::new(TsType::TsTupleType(TsTupleType {
                    span: arr.span,
                    elem_types,
                }));

                if as_readonly {
                    result = ts_readonly(result);
                }
                Some(result)
            }

            Expr::Object(obj) => {
                let mut members: Vec<TsTypeElement> = vec![];

                // TODO: Prescan all object properties to know which ones
                // have a getter or a setter. This allows us to apply
                // TypeScript's `readonly` keyword accordingly.

                for item in obj.props {
                    match item {
                        PropOrSpread::Prop(prop_box) => {
                            let prop = *prop_box;
                            match prop {
                                Prop::KeyValue(key_value) => {
                                    let (key, computed) = match key_value.key {
                                        PropName::Ident(ident) => {
                                            (Expr::Ident(ident.into()), false)
                                        }
                                        PropName::Str(str_prop) => {
                                            (Lit::Str(str_prop).into(), false)
                                        }
                                        PropName::Num(num) => (Lit::Num(num).into(), true),
                                        PropName::Computed(computed) => (*computed.expr, true),
                                        PropName::BigInt(big_int) => {
                                            (Lit::BigInt(big_int).into(), true)
                                        }
                                    };

                                    let init_type = self
                                        .expr_to_ts_type(key_value.value, as_const, as_readonly)
                                        .map(type_ann);

                                    members.push(TsTypeElement::TsPropertySignature(
                                        TsPropertySignature {
                                            span: DUMMY_SP,
                                            readonly: as_readonly,
                                            key: Box::new(key),
                                            computed,
                                            optional: false,
                                            type_ann: init_type,
                                        },
                                    ));
                                }
                                Prop::Shorthand(_)
                                | Prop::Assign(_)
                                | Prop::Getter(_)
                                | Prop::Setter(_)
                                | Prop::Method(_) => {
                                    self.mark_diagnostic_unsupported_prop(prop.span());
                                }
                            }
                        }
                        PropOrSpread::Spread(_) => {
                            self.mark_diagnostic(DtsIssue::UnableToInferTypeFromSpread {
                                range: self.source_range_to_range(item.span()),
                            })
                        }
                    }
                }

                Some(Box::new(TsType::TsTypeLit(TsTypeLit {
                    span: obj.span,
                    members,
                })))
            }
            Expr::Lit(lit) => {
                if as_const {
                    maybe_lit_to_ts_type_const(&lit)
                } else {
                    maybe_lit_to_ts_type(&lit)
                }
            }
            Expr::TsConstAssertion(ts_const) => self.expr_to_ts_type(ts_const.expr, true, true),
            Expr::TsSatisfies(satisifies) => {
                self.expr_to_ts_type(satisifies.expr, as_const, as_readonly)
            }
            Expr::TsAs(ts_as) => Some(ts_as.type_ann),
            Expr::Fn(fn_expr) => {
                let return_type = fn_expr
                    .function
                    .return_type
                    .map_or(any_type_ann(), |val| val);

                let params: Vec<TsFnParam> = fn_expr
                    .function
                    .params
                    .into_iter()
                    .filter_map(|param| self.pat_to_ts_fn_param(param.pat))
                    .collect();

                Some(Box::new(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: fn_expr.function.span,
                        params,
                        type_ann: return_type,
                        type_params: fn_expr.function.type_params,
                    }),
                )))
            }
            Expr::Arrow(arrow_expr) => {
                let return_type = arrow_expr.return_type.map_or(any_type_ann(), |val| val);

                let params = arrow_expr
                    .params
                    .into_iter()
                    .filter_map(|pat| self.pat_to_ts_fn_param(pat))
                    .collect();

                Some(Box::new(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: arrow_expr.span,
                        params,
                        type_ann: return_type,
                        type_params: arrow_expr.type_params,
                    }),
                )))
            }
            // Since fast check requires explicit type annotations these
            // can be dropped as they are not part of an export declaration
            Expr::This(_)
            | Expr::Unary(_)
            | Expr::Update(_)
            | Expr::Bin(_)
            | Expr::Assign(_)
            | Expr::Member(_)
            | Expr::SuperProp(_)
            | Expr::Cond(_)
            | Expr::Call(_)
            | Expr::New(_)
            | Expr::Seq(_)
            | Expr::Ident(_)
            | Expr::Tpl(_)
            | Expr::TaggedTpl(_)
            | Expr::Class(_)
            | Expr::Yield(_)
            | Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::Paren(_)
            | Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsNonNull(_)
            | Expr::TsInstantiation(_)
            | Expr::PrivateName(_)
            | Expr::OptChain(_)
            | Expr::Invalid(_) => None,
        }
    }

    fn decl_to_type_decl(&mut self, decl: &mut Decl) -> Option<()> {
        let is_declare = self.is_top_level;
        match decl {
            Decl::Class(class_decl) => {
                self.class_body_to_type(&mut class_decl.class.body);
                class_decl.declare = is_declare;
                Some(())
            }
            Decl::Fn(fn_decl) => {
                fn_decl.function.body = None;
                fn_decl.declare = is_declare;

                for param in &mut fn_decl.function.params {
                    match &mut param.pat {
                        Pat::Ident(ident) => {
                            if ident.type_ann.is_none() {
                                self.mark_diagnostic_any_fallback(ident.span());
                                ident.type_ann = Some(any_type_ann());
                            }
                        }
                        Pat::Assign(assign_pat) => {
                            match &mut *assign_pat.left {
                                Pat::Ident(ident) => {
                                    if ident.type_ann.is_none() {
                                        ident.type_ann = self.infer_expr_fallback_any(
                                            assign_pat.right.take(),
                                            false,
                                            false,
                                        );
                                    }

                                    ident.optional = true;
                                    param.pat = ident.clone().into();
                                }
                                Pat::Array(arr_pat) => {
                                    if arr_pat.type_ann.is_none() {
                                        arr_pat.type_ann = self.infer_expr_fallback_any(
                                            assign_pat.right.take(),
                                            false,
                                            false,
                                        );
                                    }

                                    arr_pat.optional = true;
                                    param.pat = arr_pat.clone().into();
                                }
                                Pat::Object(obj_pat) => {
                                    if obj_pat.type_ann.is_none() {
                                        obj_pat.type_ann = self.infer_expr_fallback_any(
                                            assign_pat.right.take(),
                                            false,
                                            false,
                                        );
                                    }

                                    obj_pat.optional = true;
                                    param.pat = obj_pat.clone().into();
                                }
                                Pat::Rest(_) | Pat::Assign(_) | Pat::Expr(_) | Pat::Invalid(_) => {}
                            };
                        }
                        Pat::Array(_)
                        | Pat::Rest(_)
                        | Pat::Object(_)
                        | Pat::Invalid(_)
                        | Pat::Expr(_) => {}
                    }
                }

                Some(())
            }
            Decl::Var(var_decl) => {
                var_decl.declare = is_declare;

                for decl in &mut var_decl.decls {
                    if let Pat::Ident(ident) = &mut decl.name {
                        if ident.type_ann.is_some() {
                            decl.init = None;
                            continue;
                        }

                        let ts_type = decl
                            .init
                            .take()
                            .and_then(|init| self.expr_to_ts_type(init, false, true))
                            .map(type_ann)
                            .or_else(|| {
                                self.mark_diagnostic_any_fallback(ident.span());
                                Some(any_type_ann())
                            });
                        ident.type_ann = ts_type;
                    } else {
                        self.mark_diagnostic_unable_to_infer(decl.span());
                    }

                    decl.init = None;
                }

                Some(())
            }
            Decl::TsEnum(ts_enum) => {
                ts_enum.declare = is_declare;

                for member in &mut ts_enum.members {
                    if let Some(init) = &member.init {
                        // Support for expressions is limited in enums,
                        // see https://www.typescriptlang.org/docs/handbook/enums.html
                        member.init = if self.valid_enum_init_expr(init) {
                            Some(init.clone())
                        } else {
                            None
                        };
                    }
                }

                Some(())
            }
            Decl::TsModule(ts_module) => {
                ts_module.declare = is_declare;

                if let Some(body) = ts_module.body.take() {
                    ts_module.body = Some(self.transform_ts_ns_body(body));

                    Some(())
                } else {
                    Some(())
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => Some(()),
            Decl::Using(_) => {
                self.mark_diagnostic(DtsIssue::UnsupportedUsing {
                    range: self.source_range_to_range(decl.span()),
                });
                None
            }
        }
    }

    fn transform_ts_ns_body(&mut self, ns: TsNamespaceBody) -> TsNamespaceBody {
        let original_is_top_level = self.is_top_level;
        self.is_top_level = false;
        let body = match ns {
            TsNamespaceBody::TsModuleBlock(mut ts_module_block) => {
                self.transform_module_items(&mut ts_module_block.body);
                TsNamespaceBody::TsModuleBlock(ts_module_block)
            }
            TsNamespaceBody::TsNamespaceDecl(ts_ns) => self.transform_ts_ns_body(*ts_ns.body),
        };
        self.is_top_level = original_is_top_level;
        body
    }

    // Support for expressions is limited in enums,
    // see https://www.typescriptlang.org/docs/handbook/enums.html
    fn valid_enum_init_expr(&mut self, expr: &Expr) -> bool {
        match expr {
            Expr::Bin(bin_expr) => {
                if !self.valid_enum_init_expr(&bin_expr.left) {
                    false
                } else {
                    self.valid_enum_init_expr(&bin_expr.right)
                }
            }

            Expr::Member(member_expr) => self.valid_enum_init_expr(&member_expr.obj),
            Expr::OptChain(opt_expr) => match &*opt_expr.base {
                OptChainBase::Member(member_expr) => {
                    self.valid_enum_init_expr(&member_expr.clone().into())
                }
                OptChainBase::Call(_) => false,
            },
            // TS does infer the type of identifiers
            Expr::Ident(_) => true,
            Expr::Lit(lit) => match lit {
                Lit::Num(_) | Lit::Str(_) => true,
                Lit::Bool(_) | Lit::Null(_) | Lit::BigInt(_) | Lit::Regex(_) | Lit::JSXText(_) => {
                    false
                }
            },
            Expr::Tpl(tpl_expr) => {
                for expr in &tpl_expr.exprs {
                    if !self.valid_enum_init_expr(expr) {
                        return false;
                    }
                }
                true
            }

            Expr::Paren(paren_expr) => self.valid_enum_init_expr(&paren_expr.expr),

            Expr::TsTypeAssertion(ts_ass) => {
                // Only assertions to number are allowed for computed
                // enum members.
                match &*ts_ass.type_ann {
                    TsType::TsLitType(ts_lit) => match ts_lit.lit {
                        TsLit::Number(_) => true,
                        TsLit::Str(_) | TsLit::Bool(_) | TsLit::BigInt(_) | TsLit::Tpl(_) => false,
                    },
                    TsType::TsKeywordType(_)
                    | TsType::TsThisType(_)
                    | TsType::TsFnOrConstructorType(_)
                    | TsType::TsTypeRef(_)
                    | TsType::TsTypeQuery(_)
                    | TsType::TsTypeLit(_)
                    | TsType::TsArrayType(_)
                    | TsType::TsTupleType(_)
                    | TsType::TsOptionalType(_)
                    | TsType::TsRestType(_)
                    | TsType::TsUnionOrIntersectionType(_)
                    | TsType::TsConditionalType(_)
                    | TsType::TsInferType(_)
                    | TsType::TsParenthesizedType(_)
                    | TsType::TsTypeOperator(_)
                    | TsType::TsIndexedAccessType(_)
                    | TsType::TsMappedType(_)
                    | TsType::TsTypePredicate(_)
                    | TsType::TsImportType(_) => false,
                }
            }

            Expr::TsAs(ts_as) => self.valid_enum_ts_type(&ts_as.type_ann),

            // These are not valid as enum member initializer and
            // TS will throw a type error. For declaration generation
            // they will be dropped in TS so we do that too.
            Expr::TsInstantiation(_)
            | Expr::Call(_)
            | Expr::Update(_)
            | Expr::PrivateName(_)
            | Expr::TsSatisfies(_)
            | Expr::TsNonNull(_)
            | Expr::TsConstAssertion(_)
            | Expr::Cond(_)
            | Expr::Seq(_)
            | Expr::TaggedTpl(_)
            | Expr::Object(_)
            | Expr::Array(_)
            | Expr::Arrow(_)
            | Expr::Class(_)
            | Expr::Await(_)
            | Expr::MetaProp(_)
            | Expr::New(_)
            | Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::Unary(_)
            | Expr::Assign(_)
            | Expr::Yield(_)
            | Expr::SuperProp(_)
            | Expr::Fn(_)
            | Expr::This(_)
            | Expr::Invalid(_) => false,
        }
    }

    fn valid_enum_ts_type(&mut self, ts_type: &TsType) -> bool {
        match ts_type {
            TsType::TsLitType(ts_lit) => match ts_lit.lit {
                TsLit::Number(_) => true,
                TsLit::Str(_) | TsLit::Bool(_) | TsLit::BigInt(_) | TsLit::Tpl(_) => false,
            },
            TsType::TsKeywordType(_)
            | TsType::TsThisType(_)
            | TsType::TsFnOrConstructorType(_)
            | TsType::TsTypeRef(_)
            | TsType::TsTypeQuery(_)
            | TsType::TsTypeLit(_)
            | TsType::TsArrayType(_)
            | TsType::TsTupleType(_)
            | TsType::TsOptionalType(_)
            | TsType::TsRestType(_)
            | TsType::TsUnionOrIntersectionType(_)
            | TsType::TsConditionalType(_)
            | TsType::TsInferType(_)
            | TsType::TsParenthesizedType(_)
            | TsType::TsTypeOperator(_)
            | TsType::TsIndexedAccessType(_)
            | TsType::TsMappedType(_)
            | TsType::TsTypePredicate(_)
            | TsType::TsImportType(_) => false,
        }
    }

    fn infer_expr_fallback_any(
        &mut self,
        expr: Box<Expr>,
        as_const: bool,
        as_readonly: bool,
    ) -> Option<Box<TsTypeAnn>> {
        let span = expr.span();

        if let Some(ts_type) = self.expr_to_ts_type(expr, as_const, as_readonly) {
            Some(type_ann(ts_type))
        } else {
            self.mark_diagnostic_any_fallback(span);
            Some(any_type_ann())
        }
    }

    fn class_body_to_type(&mut self, body: &mut Vec<ClassMember>) {
        // Track if the previous member was an overload signature or not.
        // When overloads are present the last item has the implementation
        // body. For declaration files the implementation always needs to
        // be dropped. Needs to be unique for each class because another
        // class could be created inside a class method.
        let mut prev_is_overload = false;

        let new_body = body
            .take()
            .into_iter()
            .filter(|member| match member {
                ClassMember::Constructor(class_constructor) => {
                    let is_overload = class_constructor.body.is_none();
                    if !prev_is_overload || is_overload {
                        prev_is_overload = is_overload;
                        true
                    } else {
                        prev_is_overload = false;
                        false
                    }
                }
                ClassMember::Method(method) => {
                    let is_overload = method.function.body.is_none();
                    if !prev_is_overload || is_overload {
                        prev_is_overload = is_overload;
                        true
                    } else {
                        prev_is_overload = false;
                        false
                    }
                }
                ClassMember::TsIndexSignature(_)
                | ClassMember::ClassProp(_)
                | ClassMember::PrivateProp(_)
                | ClassMember::Empty(_)
                | ClassMember::StaticBlock(_)
                | ClassMember::AutoAccessor(_)
                | ClassMember::PrivateMethod(_) => {
                    prev_is_overload = false;
                    true
                }
            })
            .filter_map(|member| match member {
                ClassMember::Constructor(mut class_constructor) => {
                    class_constructor.body = None;
                    Some(ClassMember::Constructor(class_constructor))
                }
                ClassMember::Method(mut method) => {
                    method.function.body = None;
                    if method.kind == MethodKind::Setter {
                        method.function.return_type = None;
                    }
                    Some(ClassMember::Method(method))
                }
                ClassMember::ClassProp(mut prop) => {
                    if prop.type_ann.is_none() {
                        if let Some(value) = prop.value {
                            prop.type_ann = self
                                .expr_to_ts_type(value, false, false)
                                .map(type_ann)
                                .or_else(|| Some(any_type_ann()));
                        }
                    }
                    prop.value = None;
                    prop.definite = false;
                    prop.declare = false;

                    Some(ClassMember::ClassProp(prop))
                }
                ClassMember::TsIndexSignature(index_sig) => {
                    Some(ClassMember::TsIndexSignature(index_sig))
                }

                // These can be removed as they are not relevant for types
                ClassMember::PrivateMethod(_)
                | ClassMember::PrivateProp(_)
                | ClassMember::Empty(_)
                | ClassMember::StaticBlock(_)
                | ClassMember::AutoAccessor(_) => None,
            })
            .collect();

        *body = new_body;
    }

    fn pat_to_ts_fn_param(&mut self, pat: Pat) -> Option<TsFnParam> {
        match pat {
            Pat::Ident(binding_id) => Some(TsFnParam::Ident(binding_id)),
            Pat::Array(arr_pat) => Some(TsFnParam::Array(arr_pat)),
            Pat::Rest(rest_pat) => Some(TsFnParam::Rest(rest_pat)),
            Pat::Object(obj) => Some(TsFnParam::Object(obj)),
            Pat::Assign(assign_pat) => {
                self.expr_to_ts_type(assign_pat.right, false, false)
                    .map(|param| {
                        let name = if let Pat::Ident(ident) = *assign_pat.left {
                            ident.sym.clone()
                        } else {
                            self.gen_unique_name()
                        };

                        TsFnParam::Ident(BindingIdent {
                            id: Ident {
                                span: assign_pat.span,
                                ctxt: Default::default(),
                                sym: name,
                                optional: false,
                            },
                            type_ann: Some(type_ann(param)),
                        })
                    })
            }
            Pat::Expr(expr) => {
                self.mark_diagnostic_unable_to_infer(expr.span());
                None
            }
            // Invalid code is invalid, not sure why SWC doesn't throw
            // a parse error here.
            Pat::Invalid(_) => None,
        }
    }

    fn gen_unique_name(&mut self) -> Atom {
        self.id_counter += 1;
        format!("_dts_{}", self.id_counter).into()
    }
}

fn any_type_ann() -> Box<TsTypeAnn> {
    type_ann(ts_keyword_type(TsKeywordTypeKind::TsAnyKeyword))
}

fn type_ann(ts_type: Box<TsType>) -> Box<TsTypeAnn> {
    Box::new(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: ts_type,
    })
}

fn type_ref(name: Atom) -> TsTypeRef {
    TsTypeRef {
        span: DUMMY_SP,
        type_name: TsEntityName::Ident(Ident::new_no_ctxt(name, DUMMY_SP)),
        type_params: None,
    }
}

fn ts_readonly(ann: Box<TsType>) -> Box<TsType> {
    Box::new(TsType::TsTypeOperator(TsTypeOperator {
        span: DUMMY_SP,
        op: TsTypeOperatorOp::ReadOnly,
        type_ann: ann,
    }))
}

fn ts_tuple_element(ts_type: Box<TsType>) -> TsTupleElement {
    TsTupleElement {
        label: None,
        span: DUMMY_SP,
        ty: ts_type,
    }
}

fn ts_keyword_type(kind: TsKeywordTypeKind) -> Box<TsType> {
    Box::new(TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind,
    }))
}

fn ts_lit_type(lit: TsLit) -> Box<TsType> {
    Box::new(TsType::TsLitType(TsLitType {
        lit,
        span: DUMMY_SP,
    }))
}

fn regex_type() -> Box<TsType> {
    Box::new(TsType::TsTypeRef(type_ref("RegExp".into())))
}

fn maybe_lit_to_ts_type_const(lit: &Lit) -> Option<Box<TsType>> {
    match lit {
        Lit::Str(lit_str) => Some(ts_lit_type(TsLit::Str(lit_str.clone()))),
        Lit::Bool(lit_bool) => Some(ts_lit_type(TsLit::Bool(*lit_bool))),
        Lit::Null(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsNullKeyword)),
        Lit::Num(lit_num) => Some(ts_lit_type(TsLit::Number(lit_num.clone()))),
        Lit::BigInt(lit_bigint) => Some(ts_lit_type(TsLit::BigInt(lit_bigint.clone()))),
        Lit::Regex(_) => Some(regex_type()),
        Lit::JSXText(_) => None,
    }
}

fn maybe_lit_to_ts_type(lit: &Lit) -> Option<Box<TsType>> {
    match lit {
        Lit::Str(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsStringKeyword)),
        Lit::Bool(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsBooleanKeyword)),
        Lit::Null(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsNullKeyword)),
        Lit::Num(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsNumberKeyword)),
        Lit::BigInt(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsBigIntKeyword)),
        Lit::Regex(_) => Some(regex_type()),
        Lit::JSXText(_) => None,
    }
}
