use std::{borrow::Cow, mem::take, sync::Arc};

use swc_atoms::Atom;
use swc_common::{FileName, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    AssignPat, BindingIdent, ClassMember, ComputedPropName, Decl, DefaultDecl, ExportDecl,
    ExportDefaultExpr, Expr, Ident, Lit, MethodKind, ModuleDecl, ModuleItem, OptChainBase, Param,
    ParamOrTsParamProp, Pat, Program, Prop, PropName, PropOrSpread, Stmt, TsEntityName,
    TsFnOrConstructorType, TsFnParam, TsFnType, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType,
    TsNamespaceBody, TsParamPropParam, TsPropertySignature, TsTupleElement, TsTupleType, TsType,
    TsTypeAnn, TsTypeElement, TsTypeLit, TsTypeOperator, TsTypeOperatorOp, TsTypeRef, VarDecl,
    VarDeclKind, VarDeclarator,
    AssignPat, BindingIdent, ClassMember, Decl, DefaultDecl, ExportDecl, ExportDefaultDecl,
    ExportDefaultExpr, Expr, FnDecl, FnExpr, Ident, Lit, MethodKind, Module, ModuleDecl,
    ModuleItem, OptChainBase, Param, ParamOrTsParamProp, Pat, Prop, PropName, PropOrSpread, Stmt,
    TsEntityName, TsFnOrConstructorType, TsFnParam, TsFnType, TsKeywordType, TsKeywordTypeKind,
    TsLit, TsLitType, TsNamespaceBody, TsParamPropParam, TsPropertySignature, TsTupleElement,
    TsTupleType, TsType, TsTypeAnn, TsTypeElement, TsTypeLit, TsTypeOperator, TsTypeOperatorOp,
    TsTypeRef, VarDecl, VarDeclKind, VarDeclarator,
    ExportDefaultDecl, ExportDefaultExpr, Expr, FnDecl, FnExpr, Ident, Lit, MethodKind, Module,
    ModuleDecl, ModuleItem, OptChainBase, Param, ParamOrTsParamProp, Pat, Prop, PropName,
    ExportDefaultDecl, ExportDefaultExpr, Expr, FnDecl, FnExpr, Ident, Lit, MethodKind, ModuleDecl,
    ModuleItem, OptChainBase, Param, ParamOrTsParamProp, Pat, Program, Prop, PropName,
    PropOrSpread, Stmt, TsEntityName, TsFnOrConstructorType, TsFnParam, TsFnType, TsKeywordType,
    TsKeywordTypeKind, TsLit, TsLitType, TsNamespaceBody, TsParamPropParam, TsPropertySignature,
    TsTupleElement, TsTupleType, TsType, TsTypeAnn, TsTypeElement, TsTypeLit, TsTypeOperator,
    TsTypeOperatorOp, TsTypeRef, VarDecl, VarDeclKind, VarDeclarator,
    BindingIdent, ComputedPropName, ExportDefaultExpr, Expr, Ident, Lit, ModuleDecl, ModuleItem,
    OptChainBase, Pat, Program, PropName, TsEntityName, TsKeywordType, TsKeywordTypeKind, TsLit,
    TsLitType, TsTupleElement, TsType, TsTypeAnn, TsTypeOperator, TsTypeOperatorOp, TsTypeRef,
    VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::{VisitMutWith, VisitWith};
use type_usage::{TypeRemover, TypeUsageAnalyzer};

use crate::diagnostic::{DtsIssue, SourceRange};

mod class;
mod decl;
mod r#enum;
mod function;
mod inferrer;
mod type_usage;

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
    diagnostics: Vec<DtsIssue>,
    id_counter: u32,
    // TODO: strip_internal: bool,
}

/// Diagnostics
impl FastDts {
    pub fn new(filename: Arc<FileName>) -> Self {
        Self {
            filename,
            diagnostics: Vec::new(),
            id_counter: 0,
        }
    }

    pub fn mark_diagnostic<T: Into<Cow<'static, str>>>(&mut self, message: T, range: Span) {
        self.diagnostics.push(DtsIssue {
            message: message.into(),
            range: SourceRange {
                filename: self.filename.clone(),
                span: range,
            },
        })
    }
}

impl FastDts {
    pub fn transform(&mut self, program: &mut Program) -> Vec<DtsIssue> {
        // 1. Transform. We only keep decls.
        match program {
            Program::Module(module) => {
                module
                    .body
                    .retain(|item| item.as_stmt().map(|stmt| stmt.is_decl()).unwrap_or(true));
                Self::remove_module_function_overloads(module);
                self.transform_module_items(&mut module.body);
            }
            Program::Script(script) => {
                script.body.retain(|stmt| stmt.is_decl());
                Self::remove_script_function_overloads(script);
                for stmt in script.body.iter_mut() {
                    self.transform_decl(stmt.as_mut_decl().unwrap());
                }
            }
            Program::Script(script) => script
                .body
                .retain_mut(|stmt| self.transform_module_stmt(stmt)),
        }

        // 2. Remove unused imports and decls
        let mut type_usage_analyzer = TypeUsageAnalyzer::default();
        program.visit_with(&mut type_usage_analyzer);
        program.visit_mut_with(&mut TypeRemover::new(
            &type_usage_analyzer,
            program.is_module(),
        ));

        take(&mut self.diagnostics)
    }

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let orig_items = take(items);
        let mut new_items = Vec::with_capacity(orig_items.len());

        for mut item in orig_items {
            match &mut item {
                ModuleItem::ModuleDecl(
                    ModuleDecl::Import(..)
                    | ModuleDecl::TsImportEquals(_)
                    | ModuleDecl::TsNamespaceExport(_)
                    | ModuleDecl::TsExportAssignment(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::ExportAll(_),
                ) => new_items.push(item),
                ModuleItem::Stmt(stmt) => {
                    self.transform_decl(stmt.as_mut_decl().unwrap());
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(expor_decl)) => {
                    self.transform_decl(&mut expor_decl.decl);
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    self.transform_default_decl(&mut export.decl);
                    new_items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                    let name_ident = Ident::new_no_ctxt(self.gen_unique_name("_default"), DUMMY_SP);
                    let type_ann = self
                        .infer_type_from_expr(&export.expr, false, true)
                        .map(type_ann);

                    if type_ann.is_none() {
                        self.default_export_inferred(export.expr.span());
                    }

                    new_items.push(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            declare: true,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(BindingIdent {
                                    id: name_ident.clone(),
                                    type_ann,
                                }),
                                init: None,
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    );

                    new_items.push(
                        ExportDefaultExpr {
                            span: export.span,
                            expr: name_ident.into(),
                        }
                        .into(),
                    )
                }
            }
        }

        *items = new_items;
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
        if let Some(ts_type) = self.infer_type_from_expr(&expr, as_const, as_readonly) {
            Some(type_ann(ts_type))
        } else {
            // self.mark_diagnostic_any_fallback(span);
            Some(any_type_ann())
        }
    }

    fn gen_unique_name(&mut self, name: &str) -> Atom {
        self.id_counter += 1;
        format!("{name}_{}", self.id_counter).into()
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

fn valid_prop_name(prop_name: &PropName) -> Option<PropName> {
    fn prop_name_from_expr(expr: &Expr) -> Option<PropName> {
        match expr {
            Expr::Lit(e) => match &e {
                Lit::Str(e) => Some(PropName::Str(e.clone())),
                Lit::Num(e) => Some(PropName::Num(e.clone())),
                Lit::BigInt(e) => Some(PropName::BigInt(e.clone())),
                Lit::Bool(_) | Lit::Null(_) | Lit::Regex(_) | Lit::JSXText(_) => None,
            },
            Expr::Tpl(e) => {
                if e.quasis.is_empty() && e.exprs.len() == 1 {
                    prop_name_from_expr(&e.exprs[0])
                } else {
                    None
                }
            }
            Expr::Paren(e) => prop_name_from_expr(&e.expr),
            Expr::TsTypeAssertion(e) => prop_name_from_expr(&e.expr),
            Expr::TsConstAssertion(e) => prop_name_from_expr(&e.expr),
            Expr::TsNonNull(e) => prop_name_from_expr(&e.expr),
            Expr::TsAs(e) => prop_name_from_expr(&e.expr),
            Expr::TsSatisfies(e) => prop_name_from_expr(&e.expr),
            Expr::Ident(_) => Some(PropName::Computed(ComputedPropName {
                span: expr.span(),
                expr: Box::new(expr.clone()),
            })),
            Expr::TaggedTpl(_)
            | Expr::This(_)
            | Expr::Array(_)
            | Expr::Object(_)
            | Expr::Fn(_)
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
            | Expr::Arrow(_)
            | Expr::Class(_)
            | Expr::Yield(_)
            | Expr::Await(_)
            | Expr::MetaProp(_)
            | Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsInstantiation(_)
            | Expr::PrivateName(_)
            | Expr::OptChain(_)
            | Expr::Invalid(_) => None,
        }
    }

    match prop_name {
        PropName::Ident(_) | PropName::Str(_) | PropName::Num(_) | PropName::BigInt(_) => {
            Some(prop_name.clone())
        }
        PropName::Computed(computed) => prop_name_from_expr(&computed.expr),
    }
}
