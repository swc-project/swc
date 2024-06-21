#![allow(clippy::boxed_local)]

use std::mem::take;

use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, ClassMember, Decl, DefaultDecl, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
    Expr, FnDecl, FnExpr, Ident, Lit, MethodKind, Module, ModuleDecl, ModuleItem, OptChainBase,
    Pat, Prop, PropName, PropOrSpread, Stmt, TsEntityName, TsFnOrConstructorType, TsFnParam,
    TsFnType, TsKeywordType, TsKeywordTypeKind, TsLit, TsNamespaceBody, TsPropertySignature,
    TsTupleElement, TsTupleType, TsType, TsTypeAnn, TsTypeElement, TsTypeLit, TsTypeOperator,
    TsTypeOperatorOp, TsTypeRef,
};

pub struct Checker {
    is_top_level: bool,
}

impl Checker {
    pub fn transform(&mut self, module: &mut Module) {
        self.is_top_level = true;

        self.transform_module_items(&mut module.body);
    }

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let items = take(items);
        let mut new_items = Vec::with_capacity(items.len());

        let mut prev_is_overload = false;

        for mut item in items {
            let is_overload = match item {
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
                })) => match decl {
                    DefaultDecl::Fn(FnExpr { function, .. }) => function.body.is_none(),
                    _ => false,
                },

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

                    if let Some(decl) = self.decl_to_type_decl(decl) {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                            ExportDecl { decl, span: *span },
                        )));
                    } else {
                        self.mark_diagnostic(FastCheckDtsDiagnostic::UnableToInferType {
                            range: self.source_range_to_range(export_decl.range()),
                        })
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    match &mut export.decl {
                        DefaultDecl::Class(mut class_expr) => {
                            class_expr.class.body = self.class_body_to_type(class_expr.class.body);

                            export.decl = DefaultDecl::Class(class_expr);
                        }
                        DefaultDecl::Fn(mut fn_expr) => {
                            fn_expr.function.body = None;
                            export.decl = DefaultDecl::Fn(fn_expr);
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
                    let name_ident = Ident::new(name.into(), DUMMY_SP);
                    let type_ann = self
                        .expr_to_ts_type(*export.expr.clone(), false, true)
                        .map(type_ann);

                    if let Some(type_ann) = type_ann {
                        new_items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(
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
                            },
                        )))));

                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                            ExportDefaultExpr {
                                span: export.span,
                                expr: Box::new(Expr::Ident(name_ident)),
                            },
                        )))
                    } else {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                            ExportDefaultExpr {
                                span: export.span,
                                expr: export.expr,
                            },
                        )))
                    }
                }

                ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::TsEnum(_)
                    | Decl::Class(_)
                    | Decl::Fn(_)
                    | Decl::Var(_)
                    | Decl::TsModule(_) => {
                        if let Some(decl) = self.decl_to_type_decl(decl) {
                            new_items.push(ModuleItem::Stmt(Stmt::Decl(decl)));
                        } else {
                            self.mark_diagnostic_unable_to_infer(decl.range())
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
    ) -> Option<TsType> {
        match *e {
            Expr::Array(arr) => {
                let mut elem_types: Vec<TsTupleElement> = vec![];

                for elems in arr.elems {
                    if let Some(expr_or_spread) = elems {
                        if let Some(ts_expr) =
                            self.expr_to_ts_type(expr_or_spread.expr, as_const, as_readonly)
                        {
                            elem_types.push(ts_tuple_element(ts_expr));
                        } else {
                            self.mark_diagnostic_unable_to_infer(expr_or_spread);
                        }
                    } else {
                        // TypeScript converts holey arrays to any
                        // Example: const a = [,,] -> const a = [any, any, any]
                        elem_types.push(ts_tuple_element(TsType::TsKeywordType(TsKeywordType {
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                            span: DUMMY_SP,
                        })))
                    }
                }

                let mut result = TsType::TsTupleType(TsTupleType {
                    span: arr.span,
                    elem_types,
                });

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
                                        PropName::Ident(ident) => (Expr::Ident(ident), false),
                                        PropName::Str(str_prop) => {
                                            (Expr::Lit(Lit::Str(str_prop)), false)
                                        }
                                        PropName::Num(num) => (Expr::Lit(Lit::Num(num)), true),
                                        PropName::Computed(computed) => (*computed.expr, true),
                                        PropName::BigInt(big_int) => {
                                            (Expr::Lit(Lit::BigInt(big_int)), true)
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
                                    self.mark_diagnostic_unsupported_prop(prop.range());
                                }
                            }
                        }
                        PropOrSpread::Spread(_) => self.mark_diagnostic(
                            FastCheckDtsDiagnostic::UnableToInferTypeFromSpread {
                                range: self.source_range_to_range(item.range()),
                            },
                        ),
                    }
                }

                Some(TsType::TsTypeLit(TsTypeLit {
                    span: obj.span,
                    members,
                }))
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
            Expr::TsAs(ts_as) => Some(*ts_as.type_ann),
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

                Some(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: fn_expr.function.span,
                        params,
                        type_ann: return_type,
                        type_params: fn_expr.function.type_params,
                    }),
                ))
            }
            Expr::Arrow(arrow_expr) => {
                let return_type = arrow_expr.return_type.map_or(any_type_ann(), |val| val);

                let params = arrow_expr
                    .params
                    .into_iter()
                    .filter_map(|pat| self.pat_to_ts_fn_param(pat))
                    .collect();

                Some(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: arrow_expr.span,
                        params,
                        type_ann: return_type,
                        type_params: arrow_expr.type_params,
                    }),
                ))
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

    fn decl_to_type_decl(&mut self, decl: &mut Decl) -> Option<Decl> {
        let is_declare = self.is_top_level;
        match decl {
            Decl::Class(mut class_decl) => {
                class_decl.class.body = self.class_body_to_type(class_decl.class.body);
                class_decl.declare = is_declare;
                Some(Decl::Class(class_decl))
            }
            Decl::Fn(mut fn_decl) => {
                fn_decl.function.body = None;
                fn_decl.declare = is_declare;

                for param in &mut fn_decl.function.params {
                    match &mut param.pat {
                        Pat::Ident(ident) => {
                            if ident.type_ann.is_none() {
                                self.mark_diagnostic_any_fallback(ident.range());
                                ident.type_ann = Some(any_type_ann());
                            }
                        }
                        Pat::Assign(assign_pat) => {
                            match &mut *assign_pat.left {
                                Pat::Ident(ident) => {
                                    if ident.type_ann.is_none() {
                                        ident.type_ann = self.infer_expr_fallback_any(
                                            *assign_pat.right.clone(),
                                            false,
                                            false,
                                        );
                                    }

                                    ident.optional = true;
                                    param.pat = Pat::Ident(ident.clone());
                                }
                                Pat::Array(arr_pat) => {
                                    if arr_pat.type_ann.is_none() {
                                        arr_pat.type_ann = self.infer_expr_fallback_any(
                                            *assign_pat.right.clone(),
                                            false,
                                            false,
                                        );
                                    }

                                    arr_pat.optional = true;
                                    param.pat = Pat::Array(arr_pat.clone());
                                }
                                Pat::Object(obj_pat) => {
                                    if obj_pat.type_ann.is_none() {
                                        obj_pat.type_ann = self.infer_expr_fallback_any(
                                            *assign_pat.right.clone(),
                                            false,
                                            false,
                                        );
                                    }

                                    obj_pat.optional = true;
                                    param.pat = Pat::Object(obj_pat.clone());
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

                Some(Decl::Fn(fn_decl))
            }
            Decl::Var(mut var_decl) => {
                var_decl.declare = is_declare;

                for decl in &mut var_decl.decls {
                    if let Pat::Ident(ident) = &mut decl.name {
                        if ident.type_ann.is_some() {
                            decl.init = None;
                            continue;
                        }

                        let ts_type = decl
                            .init
                            .as_ref()
                            .and_then(|init_box| {
                                let init = *init_box.clone();
                                self.expr_to_ts_type(init, false, true)
                            })
                            .map(type_ann)
                            .or_else(|| {
                                self.mark_diagnostic_any_fallback(ident.range());
                                Some(any_type_ann())
                            });
                        ident.type_ann = ts_type;
                    } else {
                        self.mark_diagnostic_unable_to_infer(decl.range());
                    }

                    decl.init = None;
                }

                Some(Decl::Var(var_decl))
            }
            Decl::TsEnum(mut ts_enum) => {
                ts_enum.declare = is_declare;

                for member in &mut ts_enum.members {
                    if let Some(init) = &member.init {
                        // Support for expressions is limited in enums,
                        // see https://www.typescriptlang.org/docs/handbook/enums.html
                        member.init = if self.valid_enum_init_expr(*init.clone()) {
                            Some(init.clone())
                        } else {
                            None
                        };
                    }
                }

                Some(Decl::TsEnum(ts_enum))
            }
            Decl::TsModule(mut ts_module) => {
                ts_module.declare = is_declare;

                if let Some(body) = ts_module.body.clone() {
                    ts_module.body = Some(self.transform_ts_ns_body(body));

                    Some(Decl::TsModule(ts_module))
                } else {
                    Some(Decl::TsModule(ts_module))
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => Some(decl),
            Decl::Using(_) => {
                self.mark_diagnostic(FastCheckDtsDiagnostic::UnsupportedUsing {
                    range: self.source_range_to_range(decl.range()),
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
                ts_module_block.body = self.transform_module_items(ts_module_block.body);
                TsNamespaceBody::TsModuleBlock(ts_module_block)
            }
            TsNamespaceBody::TsNamespaceDecl(ts_ns) => self.transform_ts_ns_body(*ts_ns.body),
        };
        self.is_top_level = original_is_top_level;
        body
    }

    // Support for expressions is limited in enums,
    // see https://www.typescriptlang.org/docs/handbook/enums.html
    fn valid_enum_init_expr(&mut self, expr: Expr) -> bool {
        match expr {
            Expr::Bin(bin_expr) => {
                if !self.valid_enum_init_expr(*bin_expr.left) {
                    false
                } else {
                    self.valid_enum_init_expr(*bin_expr.right)
                }
            }

            Expr::Member(member_expr) => self.valid_enum_init_expr(*member_expr.obj),
            Expr::OptChain(opt_expr) => match *opt_expr.base {
                OptChainBase::Member(member_expr) => {
                    self.valid_enum_init_expr(Expr::Member(member_expr))
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
                for expr in tpl_expr.exprs {
                    if !self.valid_enum_init_expr(*expr) {
                        return false;
                    }
                }
                true
            }

            Expr::Paren(paren_expr) => self.valid_enum_init_expr(*paren_expr.expr),

            Expr::TsTypeAssertion(ts_ass) => {
                // Only assertions to number are allowed for computed
                // enum members.
                match *ts_ass.type_ann {
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

            Expr::TsAs(ts_as) => self.valid_enum_ts_type(*ts_as.type_ann),

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

    fn valid_enum_ts_type(&mut self, ts_type: TsType) -> bool {
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
        if let Some(ts_type) = self.expr_to_ts_type(expr, as_const, as_readonly) {
            Some(type_ann(ts_type))
        } else {
            self.mark_diagnostic_any_fallback(expr.range());
            Some(any_type_ann())
        }
    }

    fn class_body_to_type(&mut self, body: Vec<ClassMember>) -> Vec<ClassMember> {
        // Track if the previous member was an overload signature or not.
        // When overloads are present the last item has the implementation
        // body. For declaration files the implementation always needs to
        // be dropped. Needs to be unique for each class because another
        // class could be created inside a class method.
        let mut prev_is_overload = false;

        body.into_iter()
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
            .collect()
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
                            ident.id.sym.clone()
                        } else {
                            self.gen_unique_name()
                        };

                        TsFnParam::Ident(BindingIdent {
                            id: Ident::new(name.into(), assign_pat.span),
                            type_ann: Some(type_ann(param)),
                        })
                    })
            }
            Pat::Expr(expr) => {
                self.mark_diagnostic_unable_to_infer(expr.range());
                None
            }
            // Invalid code is invalid, not sure why SWC doesn't throw
            // a parse error here.
            Pat::Invalid(_) => None,
        }
    }
}

fn is_void_type(return_type: &TsType) -> bool {
    is_keyword_type(return_type, TsKeywordTypeKind::TsVoidKeyword)
}

fn is_keyword_type(return_type: &TsType, kind: TsKeywordTypeKind) -> bool {
    match return_type {
        TsType::TsKeywordType(TsKeywordType { kind: k, .. }) => k == &kind,
        _ => false,
    }
}

fn any_type_ann() -> Box<TsTypeAnn> {
    type_ann(ts_keyword_type(TsKeywordTypeKind::TsAnyKeyword))
}

fn type_ann(ts_type: TsType) -> Box<TsTypeAnn> {
    Box::new(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: Box::new(ts_type),
    })
}

fn type_ref(name: Atom) -> TsTypeRef {
    TsTypeRef {
        span: DUMMY_SP,
        type_name: TsEntityName::Ident(Ident::new(name, DUMMY_SP)),
        type_params: None,
    }
}

fn ts_readonly(ann: TsType) -> TsType {
    TsType::TsTypeOperator(TsTypeOperator {
        span: DUMMY_SP,
        op: TsTypeOperatorOp::ReadOnly,
        type_ann: Box::new(ann),
    })
}

fn ts_tuple_element(ts_type: TsType) -> TsTupleElement {
    TsTupleElement {
        label: None,
        span: DUMMY_SP,
        ty: Box::new(ts_type),
    }
}

fn ts_keyword_type(kind: TsKeywordTypeKind) -> TsType {
    TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind,
    })
}
