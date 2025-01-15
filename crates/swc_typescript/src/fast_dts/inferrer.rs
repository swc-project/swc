use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{
    ArrowExpr, BindingIdent, BlockStmtOrExpr, Class, Expr, Function, Ident, Lit, ReturnStmt, Stmt,
    TsKeywordTypeKind, TsParenthesizedType, TsType, TsTypeAliasDecl, TsTypeAnn,
    TsUnionOrIntersectionType, TsUnionType, UnaryExpr, UnaryOp,
};
use swc_ecma_visit::{Visit, VisitWith};

use super::{
    util::types::{ts_keyword_type, type_ann},
    FastDts,
};

impl FastDts {
    pub(crate) fn infer_type_from_expr(&mut self, e: &Expr) -> Option<Box<TsType>> {
        match e {
            Expr::Lit(lit) => match lit {
                Lit::Str(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsStringKeyword)),
                Lit::Bool(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsBooleanKeyword)),
                Lit::Num(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsNumberKeyword)),
                Lit::BigInt(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsBigIntKeyword)),
                Lit::Null(_) | Lit::Regex(_) | Lit::JSXText(_) => None,
            },
            Expr::Tpl(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsStringKeyword)),
            Expr::Fn(fn_expr) => self.transform_fn_to_ts_type(
                &fn_expr.function,
                fn_expr.ident.as_ref().map(|ident| ident.span),
            ),
            Expr::Arrow(arrow_expr) => self.transform_arrow_expr_to_ts_type(arrow_expr),
            Expr::Array(arr) => {
                self.array_inferred(arr.span);
                Some(ts_keyword_type(TsKeywordTypeKind::TsUnknownKeyword))
            }
            Expr::Object(obj) => self.transform_object_to_ts_type(obj, false),
            Expr::Class(class) => {
                self.inferred_type_of_class_expression(class.span());
                Some(ts_keyword_type(TsKeywordTypeKind::TsUnknownKeyword))
            }
            Expr::Paren(expr) => self.infer_type_from_expr(&expr.expr),
            Expr::TsNonNull(non_null) => self.infer_type_from_expr(&non_null.expr),
            Expr::TsSatisfies(satisifies) => self.infer_type_from_expr(&satisifies.expr),
            Expr::TsConstAssertion(assertion) => self.transform_expr_to_ts_type(&assertion.expr),
            Expr::TsAs(ts_as) => Some(ts_as.type_ann.clone()),
            Expr::TsTypeAssertion(type_assertion) => Some(type_assertion.type_ann.clone()),
            Expr::Unary(unary) if Self::can_infer_unary_expr(unary) => {
                self.infer_type_from_expr(&unary.arg)
            }
            _ => None,
        }
    }

    pub(crate) fn infer_function_return_type(
        &mut self,
        function: &Function,
    ) -> Option<Box<TsTypeAnn>> {
        if function.return_type.is_some() {
            return function.return_type.clone();
        }

        if function.is_async || function.is_generator {
            return None;
        }

        function
            .body
            .as_ref()
            .and_then(|body| ReturnTypeInferrer::infer(self, &body.stmts))
            .map(type_ann)
    }

    pub(crate) fn infer_arrow_return_type(&mut self, arrow: &ArrowExpr) -> Option<Box<TsTypeAnn>> {
        if arrow.return_type.is_some() {
            return arrow.return_type.clone();
        }

        if arrow.is_async || arrow.is_generator {
            return None;
        }

        match arrow.body.as_ref() {
            BlockStmtOrExpr::BlockStmt(block_stmt) => {
                ReturnTypeInferrer::infer(self, &block_stmt.stmts)
            }
            BlockStmtOrExpr::Expr(expr) => self.infer_type_from_expr(expr),
        }
        .map(type_ann)
    }

    pub(crate) fn need_to_infer_type_from_expression(expr: &Expr) -> bool {
        match expr {
            Expr::Lit(lit) => !(lit.is_str() || lit.is_num() || lit.is_big_int() || lit.is_bool()),
            Expr::Tpl(tpl) => !tpl.exprs.is_empty(),
            Expr::Unary(unary) => !Self::can_infer_unary_expr(unary),
            _ => true,
        }
    }

    pub(crate) fn can_infer_unary_expr(unary: &UnaryExpr) -> bool {
        let is_arithmetic = matches!(unary.op, UnaryOp::Plus | UnaryOp::Minus);
        let is_number_lit = match unary.arg.as_ref() {
            Expr::Lit(lit) => lit.is_num() || lit.is_big_int(),
            _ => false,
        };
        is_arithmetic && is_number_lit
    }
}

#[derive(Default)]
pub struct ReturnTypeInferrer {
    value_bindings: Vec<Ident>,
    type_bindings: Vec<Ident>,
    return_expr: Option<Option<Box<Expr>>>,
    return_expr_count: u8,
}

impl ReturnTypeInferrer {
    pub fn infer(transformer: &mut FastDts, stmts: &[Stmt]) -> Option<Box<TsType>> {
        let mut visitor = ReturnTypeInferrer::default();
        stmts.visit_children_with(&mut visitor);

        let expr = visitor.return_expr??;
        let Some(mut expr_type) = transformer.infer_type_from_expr(&expr) else {
            return if expr.is_fn_expr() || expr.is_arrow() {
                Some(ts_keyword_type(TsKeywordTypeKind::TsUnknownKeyword))
            } else {
                None
            };
        };

        if let Some((ref_name, is_value)) = match expr_type.as_ref() {
            TsType::TsTypeRef(type_ref) => Some((type_ref.type_name.as_ident()?, false)),
            TsType::TsTypeQuery(type_query) => {
                Some((type_query.expr_name.as_ts_entity_name()?.as_ident()?, true))
            }
            _ => None,
        } {
            let is_defined = if is_value {
                visitor.value_bindings.contains(ref_name)
            } else {
                visitor.type_bindings.contains(ref_name)
            };

            if is_defined {
                transformer.type_containing_private_name(ref_name.sym.as_str(), ref_name.span);
            }
        }

        if visitor.return_expr_count > 1 {
            if expr_type.is_ts_fn_or_constructor_type() {
                expr_type = Box::new(TsType::TsParenthesizedType(TsParenthesizedType {
                    span: DUMMY_SP,
                    type_ann: expr_type,
                }));
            }

            expr_type = Box::new(TsType::TsUnionOrIntersectionType(
                TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: DUMMY_SP,
                    types: vec![
                        expr_type,
                        ts_keyword_type(TsKeywordTypeKind::TsUndefinedKeyword),
                    ],
                }),
            ))
        }

        Some(expr_type)
    }
}

impl Visit for ReturnTypeInferrer {
    fn visit_arrow_expr(&mut self, _node: &ArrowExpr) {}

    fn visit_function(&mut self, _node: &Function) {}

    fn visit_class(&mut self, _node: &Class) {}

    fn visit_binding_ident(&mut self, node: &BindingIdent) {
        self.value_bindings.push(node.id.clone());
    }

    fn visit_ts_type_alias_decl(&mut self, node: &TsTypeAliasDecl) {
        self.type_bindings.push(node.id.clone());
    }

    fn visit_return_stmt(&mut self, node: &ReturnStmt) {
        self.return_expr_count += 1;
        if self.return_expr_count > 1 {
            if let Some(return_expr) = &self.return_expr {
                if return_expr.is_some() {
                    self.return_expr = None;
                    return;
                }
            } else {
                return;
            }
        }
        self.return_expr = Some(node.arg.clone());
    }
}
