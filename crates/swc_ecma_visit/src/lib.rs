// This is not a public api.
#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

#[doc(hidden)]
pub extern crate swc_ecma_ast;

use std::{borrow::Cow, fmt::Debug};

use swc_common::{pass::CompilerPass, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_visit::{AndThen, Repeat, Repeated};

pub use crate::generated::*;
mod generated;

impl<A, B> Fold for AndThen<A, B>
where
    A: Fold,

    B: Fold,
{
    #[inline(always)]
    fn fold_program(&mut self, n: Program) -> Program {
        let n = self.first.fold_program(n);
        self.second.fold_program(n)
    }

    #[inline(always)]
    fn fold_module(&mut self, n: Module) -> Module {
        let n = self.first.fold_module(n);
        self.second.fold_module(n)
    }

    #[inline(always)]
    fn fold_script(&mut self, n: Script) -> Script {
        let n = self.first.fold_script(n);
        self.second.fold_script(n)
    }
}

impl<A, B> VisitMut for AndThen<A, B>
where
    A: VisitMut,
    B: VisitMut,
{
    fn visit_mut_program(&mut self, n: &mut Program) {
        self.first.visit_mut_program(n);
        self.second.visit_mut_program(n);
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.first.visit_mut_module(n);
        self.second.visit_mut_module(n)
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.first.visit_mut_script(n);
        self.second.visit_mut_script(n)
    }
}

impl<A, B> Visit for AndThen<A, B>
where
    A: Visit,
    B: Visit,
{
    fn visit_program(&mut self, n: &Program) {
        self.first.visit_program(n);
        self.second.visit_program(n);
    }

    fn visit_module(&mut self, n: &Module) {
        self.first.visit_module(n);
        self.second.visit_module(n);
    }

    fn visit_script(&mut self, n: &Script) {
        self.first.visit_script(n);
        self.second.visit_script(n);
    }
}

impl<V> Fold for Repeat<V>
where
    V: Fold + Repeated,
{
    fn fold_program(&mut self, mut node: Program) -> Program {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }

    fn fold_module(&mut self, mut node: Module) -> Module {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }

    fn fold_script(&mut self, mut node: Script) -> Script {
        loop {
            self.pass.reset();
            node = node.fold_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }

        node
    }
}

impl<V> VisitMut for Repeat<V>
where
    V: VisitMut + Repeated,
{
    fn visit_mut_program(&mut self, node: &mut Program) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        loop {
            self.pass.reset();
            node.visit_mut_with(&mut self.pass);

            if !self.pass.changed() {
                break;
            }
        }
    }
}

/// Not a public api.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
struct SpanRemover;

/// Returns a `Fold` which changes all span into `DUMMY_SP`.
pub fn span_remover() -> impl Debug + Fold + Copy + Eq + Default + 'static {
    SpanRemover
}

impl Fold for SpanRemover {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

#[macro_export]
macro_rules! assert_eq_ignore_span {
    ($l:expr, $r:expr) => {{
        use $crate::FoldWith;
        let l = $l.fold_with(&mut $crate::span_remover());
        let r = $r.fold_with(&mut $crate::span_remover());

        assert_eq!(l, r);
    }};

    ($l:expr, $r:expr, $($tts:tt)*) => {{
        use $crate::FoldWith;
        let l = $l.fold_with(&mut $crate::span_remover());
        let r = $r.fold_with(&mut $crate::span_remover());

        assert_eq!(l, r, $($tts)*);
    }};
}

/// Implemented for passes which inject variables.
///
/// If a pass depends on other pass which injects variables, this trait can be
/// used to keep the variables.
pub trait InjectVars {
    fn take_vars(&mut self) -> Vec<VarDeclarator>;
}

impl<V> InjectVars for Folder<V>
where
    V: VisitMut + InjectVars,
{
    fn take_vars(&mut self) -> Vec<VarDeclarator> {
        self.0.take_vars()
    }
}

/// The returned folder only handles `fold_script` and `fold_module`, and
/// typescript nodes are ignored. So if your visitor needs to handle typescript
/// or low-level nodes, you should use [as_folder] instead.
#[inline]
pub fn as_folder<V>(v: V) -> Folder<V>
where
    V: VisitMut,
{
    Folder(v)
}

/// Wrap a [VisitMut] as a [Fold]
#[derive(Debug, Clone, Copy)]
pub struct Folder<V: VisitMut>(V);

impl<V> Repeated for Folder<V>
where
    V: Repeated + VisitMut,
{
    fn changed(&self) -> bool {
        self.0.changed()
    }

    fn reset(&mut self) {
        self.0.reset();
    }
}

impl<V> CompilerPass for Folder<V>
where
    V: VisitMut + CompilerPass,
{
    fn name() -> Cow<'static, str> {
        V::name()
    }
}

macro_rules! delegate {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, n: &mut $T) {
            n.visit_mut_with(&mut self.0);
        }
    };
}

/// This only proxies subset of methods.
impl<V> VisitMut for Folder<V>
where
    V: VisitMut,
{
    delegate!(visit_mut_ident, Ident);

    delegate!(visit_mut_span, Span);

    delegate!(visit_mut_expr, Expr);

    delegate!(visit_mut_decl, Decl);

    delegate!(visit_mut_stmt, Stmt);

    delegate!(visit_mut_pat, Pat);

    delegate!(visit_mut_ts_type, TsType);

    delegate!(visit_mut_module, Module);

    delegate!(visit_mut_script, Script);

    delegate!(visit_mut_program, Program);
}

macro_rules! method {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, mut n: $T) -> $T {
            n.visit_mut_with(&mut self.0);
            n
        }
    };
}

impl<V> Fold for Folder<V>
where
    V: VisitMut,
{
    method!(fold_ident, Ident);

    method!(fold_span, Span);

    method!(fold_expr, Expr);

    method!(fold_decl, Decl);

    method!(fold_stmt, Stmt);

    method!(fold_pat, Pat);

    method!(fold_ts_type, TsType);

    method!(fold_script, Script);

    method!(fold_program, Program);

    method!(fold_reserved_unused, ReservedUnused);

    #[inline(always)]
    fn fold_module(&mut self, mut n: Module) -> Module {
        #[cfg(all(debug_assertions, feature = "debug"))]
        let _tracing = {
            let visitor_name = std::any::type_name::<V>();
            tracing::span!(tracing::Level::INFO, "as_folder", visitor = visitor_name).entered()
        };
        n.visit_mut_with(&mut self.0);
        n
    }
}

/// Note: Ignoring more types is not considered as a breaking change.
#[macro_export]
macro_rules! noop_fold_type {
    ($name:ident, $N:tt) => {
        fn $name(&mut self, node: $crate::swc_ecma_ast::$N) -> $crate::swc_ecma_ast::$N {
            node
        }
    };
    () => {
        noop_fold_type!(fold_accessibility, Accessibility);
        noop_fold_type!(fold_true_plus_minus, TruePlusMinus);
        noop_fold_type!(fold_ts_array_type, TsArrayType);
        noop_fold_type!(fold_ts_call_signature_decl, TsCallSignatureDecl);
        noop_fold_type!(fold_ts_conditional_type, TsConditionalType);
        noop_fold_type!(fold_ts_construct_signature_decl, TsConstructSignatureDecl);
        noop_fold_type!(fold_ts_constructor_type, TsConstructorType);
        noop_fold_type!(fold_ts_entity_name, TsEntityName);
        noop_fold_type!(fold_ts_enum_decl, TsEnumDecl);
        noop_fold_type!(fold_ts_enum_member, TsEnumMember);
        noop_fold_type!(fold_ts_enum_member_id, TsEnumMemberId);
        noop_fold_type!(fold_ts_expr_with_type_args, TsExprWithTypeArgs);
        noop_fold_type!(fold_ts_external_module_ref, TsExternalModuleRef);
        noop_fold_type!(fold_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_fold_type!(fold_ts_fn_param, TsFnParam);
        noop_fold_type!(fold_ts_fn_type, TsFnType);
        noop_fold_type!(fold_ts_import_equals_decl, TsImportEqualsDecl);
        noop_fold_type!(fold_ts_import_type, TsImportType);
        noop_fold_type!(fold_ts_index_signature, TsIndexSignature);
        noop_fold_type!(fold_ts_indexed_access_type, TsIndexedAccessType);
        noop_fold_type!(fold_ts_infer_type, TsInferType);
        noop_fold_type!(fold_ts_interface_body, TsInterfaceBody);
        noop_fold_type!(fold_ts_interface_decl, TsInterfaceDecl);
        noop_fold_type!(fold_ts_intersection_type, TsIntersectionType);
        noop_fold_type!(fold_ts_keyword_type, TsKeywordType);
        noop_fold_type!(fold_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_fold_type!(fold_ts_mapped_type, TsMappedType);
        noop_fold_type!(fold_ts_method_signature, TsMethodSignature);
        noop_fold_type!(fold_ts_module_block, TsModuleBlock);
        noop_fold_type!(fold_ts_module_decl, TsModuleDecl);
        noop_fold_type!(fold_ts_module_name, TsModuleName);
        noop_fold_type!(fold_ts_namespace_body, TsNamespaceBody);
        noop_fold_type!(fold_ts_namespace_decl, TsNamespaceDecl);
        noop_fold_type!(fold_ts_namespace_export_decl, TsNamespaceExportDecl);
        noop_fold_type!(fold_ts_optional_type, TsOptionalType);
        noop_fold_type!(fold_ts_param_prop, TsParamProp);
        noop_fold_type!(fold_ts_param_prop_param, TsParamPropParam);
        noop_fold_type!(fold_ts_parenthesized_type, TsParenthesizedType);
        noop_fold_type!(fold_ts_property_signature, TsPropertySignature);
        noop_fold_type!(fold_ts_qualified_name, TsQualifiedName);
        noop_fold_type!(fold_ts_rest_type, TsRestType);
        noop_fold_type!(fold_ts_this_type, TsThisType);
        noop_fold_type!(fold_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_fold_type!(fold_ts_tuple_type, TsTupleType);
        noop_fold_type!(fold_ts_type, TsType);
        noop_fold_type!(fold_ts_type_alias_decl, TsTypeAliasDecl);
        noop_fold_type!(fold_ts_type_ann, TsTypeAnn);
        noop_fold_type!(fold_ts_type_assertion, TsTypeAssertion);
        noop_fold_type!(fold_ts_type_element, TsTypeElement);
        noop_fold_type!(fold_ts_type_lit, TsTypeLit);
        noop_fold_type!(fold_ts_type_operator, TsTypeOperator);
        noop_fold_type!(fold_ts_type_operator_op, TsTypeOperatorOp);
        noop_fold_type!(fold_ts_type_param, TsTypeParam);
        noop_fold_type!(fold_ts_type_param_decl, TsTypeParamDecl);
        noop_fold_type!(fold_ts_type_param_instantiation, TsTypeParamInstantiation);
        noop_fold_type!(fold_ts_type_predicate, TsTypePredicate);
        noop_fold_type!(fold_ts_type_query, TsTypeQuery);
        noop_fold_type!(fold_ts_type_query_expr, TsTypeQueryExpr);
        noop_fold_type!(fold_ts_type_ref, TsTypeRef);
        noop_fold_type!(
            fold_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_fold_type!(fold_ts_union_type, TsUnionType);
    };
}

/// Note: Ignoring more types is not considered as a breaking change.
#[macro_export]
macro_rules! noop_visit_type {
    ($name:ident, $N:tt) => {
        fn $name(&mut self, _: &$crate::swc_ecma_ast::$N) {}
    };
    () => {
        noop_visit_type!(visit_accessibility, Accessibility);
        noop_visit_type!(visit_true_plus_minus, TruePlusMinus);
        noop_visit_type!(visit_ts_array_type, TsArrayType);
        noop_visit_type!(visit_ts_call_signature_decl, TsCallSignatureDecl);
        noop_visit_type!(visit_ts_conditional_type, TsConditionalType);
        noop_visit_type!(visit_ts_construct_signature_decl, TsConstructSignatureDecl);
        noop_visit_type!(visit_ts_constructor_type, TsConstructorType);
        noop_visit_type!(visit_ts_entity_name, TsEntityName);
        noop_visit_type!(visit_ts_expr_with_type_args, TsExprWithTypeArgs);
        noop_visit_type!(visit_ts_external_module_ref, TsExternalModuleRef);
        noop_visit_type!(visit_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_visit_type!(visit_ts_fn_param, TsFnParam);
        noop_visit_type!(visit_ts_fn_type, TsFnType);
        noop_visit_type!(visit_ts_import_type, TsImportType);
        noop_visit_type!(visit_ts_index_signature, TsIndexSignature);
        noop_visit_type!(visit_ts_indexed_access_type, TsIndexedAccessType);
        noop_visit_type!(visit_ts_infer_type, TsInferType);
        noop_visit_type!(visit_ts_interface_body, TsInterfaceBody);
        noop_visit_type!(visit_ts_interface_decl, TsInterfaceDecl);
        noop_visit_type!(visit_ts_intersection_type, TsIntersectionType);
        noop_visit_type!(visit_ts_keyword_type, TsKeywordType);
        noop_visit_type!(visit_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_visit_type!(visit_ts_mapped_type, TsMappedType);
        noop_visit_type!(visit_ts_method_signature, TsMethodSignature);
        noop_visit_type!(visit_ts_module_ref, TsModuleRef);
        noop_visit_type!(visit_ts_optional_type, TsOptionalType);
        noop_visit_type!(visit_ts_parenthesized_type, TsParenthesizedType);
        noop_visit_type!(visit_ts_property_signature, TsPropertySignature);
        noop_visit_type!(visit_ts_qualified_name, TsQualifiedName);
        noop_visit_type!(visit_ts_rest_type, TsRestType);
        noop_visit_type!(visit_ts_this_type, TsThisType);
        noop_visit_type!(visit_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_visit_type!(visit_ts_tuple_type, TsTupleType);
        noop_visit_type!(visit_ts_type, TsType);
        noop_visit_type!(visit_ts_type_alias_decl, TsTypeAliasDecl);
        noop_visit_type!(visit_ts_type_ann, TsTypeAnn);
        noop_visit_type!(visit_ts_type_element, TsTypeElement);
        noop_visit_type!(visit_ts_type_lit, TsTypeLit);
        noop_visit_type!(visit_ts_type_operator, TsTypeOperator);
        noop_visit_type!(visit_ts_type_operator_op, TsTypeOperatorOp);
        noop_visit_type!(visit_ts_type_param, TsTypeParam);
        noop_visit_type!(visit_ts_type_param_decl, TsTypeParamDecl);
        noop_visit_type!(visit_ts_type_param_instantiation, TsTypeParamInstantiation);
        noop_visit_type!(visit_ts_type_predicate, TsTypePredicate);
        noop_visit_type!(visit_ts_type_query, TsTypeQuery);
        noop_visit_type!(visit_ts_type_query_expr, TsTypeQueryExpr);
        noop_visit_type!(visit_ts_type_ref, TsTypeRef);
        noop_visit_type!(
            visit_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_visit_type!(visit_ts_union_type, TsUnionType);
    };
}

/// NOT A PUBLIC API
#[doc(hidden)]
#[inline(always)]
pub fn fail_not_standard() {
    unsafe {
        debug_unreachable::debug_unreachable!(
            "This visitor supports only standard ECMAScript types"
        )
    }
}

/// Mark visitor as ECMAScript standard only and mark other types as
/// unreachable.
///
/// Used to reduce the binary size.
#[macro_export]
macro_rules! standard_only_fold {
    ($name:ident, $N:ident) => {
        fn $name(&mut self, n: $crate::swc_ecma_ast::$N) -> $crate::swc_ecma_ast::$N {
            $crate::fail_not_standard();
            n
        }
    };
    () => {
        standard_only_fold!(fold_accessibility, Accessibility);
        standard_only_fold!(fold_true_plus_minus, TruePlusMinus);
        standard_only_fold!(fold_ts_array_type, TsArrayType);
        standard_only_fold!(fold_ts_call_signature_decl, TsCallSignatureDecl);
        standard_only_fold!(fold_ts_conditional_type, TsConditionalType);
        standard_only_fold!(fold_ts_construct_signature_decl, TsConstructSignatureDecl);
        standard_only_fold!(fold_ts_constructor_type, TsConstructorType);
        standard_only_fold!(fold_ts_entity_name, TsEntityName);
        standard_only_fold!(fold_ts_expr_with_type_args, TsExprWithTypeArgs);
        standard_only_fold!(fold_ts_fn_or_constructor_type, TsFnOrConstructorType);
        standard_only_fold!(fold_ts_fn_param, TsFnParam);
        standard_only_fold!(fold_ts_fn_type, TsFnType);
        standard_only_fold!(fold_ts_import_type, TsImportType);
        standard_only_fold!(fold_ts_index_signature, TsIndexSignature);
        standard_only_fold!(fold_ts_indexed_access_type, TsIndexedAccessType);
        standard_only_fold!(fold_ts_infer_type, TsInferType);
        standard_only_fold!(fold_ts_interface_body, TsInterfaceBody);
        standard_only_fold!(fold_ts_interface_decl, TsInterfaceDecl);
        standard_only_fold!(fold_ts_intersection_type, TsIntersectionType);
        standard_only_fold!(fold_ts_keyword_type, TsKeywordType);
        standard_only_fold!(fold_ts_keyword_type_kind, TsKeywordTypeKind);
        standard_only_fold!(fold_ts_mapped_type, TsMappedType);
        standard_only_fold!(fold_ts_method_signature, TsMethodSignature);
        standard_only_fold!(fold_ts_optional_type, TsOptionalType);
        standard_only_fold!(fold_ts_parenthesized_type, TsParenthesizedType);
        standard_only_fold!(fold_ts_property_signature, TsPropertySignature);
        standard_only_fold!(fold_ts_qualified_name, TsQualifiedName);
        standard_only_fold!(fold_ts_rest_type, TsRestType);
        standard_only_fold!(fold_ts_this_type, TsThisType);
        standard_only_fold!(fold_ts_this_type_or_ident, TsThisTypeOrIdent);
        standard_only_fold!(fold_ts_tuple_type, TsTupleType);
        standard_only_fold!(fold_ts_type, TsType);
        standard_only_fold!(fold_ts_type_alias_decl, TsTypeAliasDecl);
        standard_only_fold!(fold_ts_type_ann, TsTypeAnn);
        standard_only_fold!(fold_ts_type_element, TsTypeElement);
        standard_only_fold!(fold_ts_type_lit, TsTypeLit);
        standard_only_fold!(fold_ts_type_operator, TsTypeOperator);
        standard_only_fold!(fold_ts_type_operator_op, TsTypeOperatorOp);
        standard_only_fold!(fold_ts_type_param, TsTypeParam);
        standard_only_fold!(fold_ts_type_param_decl, TsTypeParamDecl);
        standard_only_fold!(fold_ts_type_param_instantiation, TsTypeParamInstantiation);
        standard_only_fold!(fold_ts_type_predicate, TsTypePredicate);
        standard_only_fold!(fold_ts_type_query, TsTypeQuery);
        standard_only_fold!(fold_ts_type_query_expr, TsTypeQueryExpr);
        standard_only_fold!(fold_ts_type_ref, TsTypeRef);
        standard_only_fold!(
            fold_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        standard_only_fold!(fold_ts_union_type, TsUnionType);

        standard_only_fold!(fold_jsx_element, JSXElement);
        standard_only_fold!(fold_jsx_fragment, JSXFragment);
        standard_only_fold!(fold_jsx_empty_expr, JSXEmptyExpr);
        standard_only_fold!(fold_jsx_member_expr, JSXMemberExpr);
        standard_only_fold!(fold_jsx_namespaced_name, JSXNamespacedName);
    };
}

/// Mark visitor as ECMAScript standard only and mark other types as
/// unreachable.
///
/// Used to reduce the binary size.
#[macro_export]
macro_rules! standard_only_visit {
    ($name:ident, $N:ident) => {
        fn $name(&mut self, _: &$crate::swc_ecma_ast::$N) {
            $crate::fail_not_standard()
        }
    };
    () => {
        standard_only_visit!(visit_accessibility, Accessibility);
        standard_only_visit!(visit_true_plus_minus, TruePlusMinus);
        standard_only_visit!(visit_ts_array_type, TsArrayType);
        standard_only_visit!(visit_ts_call_signature_decl, TsCallSignatureDecl);
        standard_only_visit!(visit_ts_conditional_type, TsConditionalType);
        standard_only_visit!(visit_ts_construct_signature_decl, TsConstructSignatureDecl);
        standard_only_visit!(visit_ts_constructor_type, TsConstructorType);
        standard_only_visit!(visit_ts_entity_name, TsEntityName);
        standard_only_visit!(visit_ts_expr_with_type_args, TsExprWithTypeArgs);
        standard_only_visit!(visit_ts_fn_or_constructor_type, TsFnOrConstructorType);
        standard_only_visit!(visit_ts_fn_param, TsFnParam);
        standard_only_visit!(visit_ts_fn_type, TsFnType);
        standard_only_visit!(visit_ts_import_type, TsImportType);
        standard_only_visit!(visit_ts_index_signature, TsIndexSignature);
        standard_only_visit!(visit_ts_indexed_access_type, TsIndexedAccessType);
        standard_only_visit!(visit_ts_infer_type, TsInferType);
        standard_only_visit!(visit_ts_interface_body, TsInterfaceBody);
        standard_only_visit!(visit_ts_interface_decl, TsInterfaceDecl);
        standard_only_visit!(visit_ts_intersection_type, TsIntersectionType);
        standard_only_visit!(visit_ts_keyword_type, TsKeywordType);
        standard_only_visit!(visit_ts_keyword_type_kind, TsKeywordTypeKind);
        standard_only_visit!(visit_ts_mapped_type, TsMappedType);
        standard_only_visit!(visit_ts_method_signature, TsMethodSignature);
        standard_only_visit!(visit_ts_optional_type, TsOptionalType);
        standard_only_visit!(visit_ts_parenthesized_type, TsParenthesizedType);
        standard_only_visit!(visit_ts_property_signature, TsPropertySignature);
        standard_only_visit!(visit_ts_qualified_name, TsQualifiedName);
        standard_only_visit!(visit_ts_rest_type, TsRestType);
        standard_only_visit!(visit_ts_this_type, TsThisType);
        standard_only_visit!(visit_ts_this_type_or_ident, TsThisTypeOrIdent);
        standard_only_visit!(visit_ts_tuple_type, TsTupleType);
        standard_only_visit!(visit_ts_type, TsType);
        standard_only_visit!(visit_ts_type_alias_decl, TsTypeAliasDecl);
        standard_only_visit!(visit_ts_type_ann, TsTypeAnn);
        standard_only_visit!(visit_ts_type_element, TsTypeElement);
        standard_only_visit!(visit_ts_type_lit, TsTypeLit);
        standard_only_visit!(visit_ts_type_operator, TsTypeOperator);
        standard_only_visit!(visit_ts_type_operator_op, TsTypeOperatorOp);
        standard_only_visit!(visit_ts_type_param, TsTypeParam);
        standard_only_visit!(visit_ts_type_param_decl, TsTypeParamDecl);
        standard_only_visit!(visit_ts_type_param_instantiation, TsTypeParamInstantiation);
        standard_only_visit!(visit_ts_type_predicate, TsTypePredicate);
        standard_only_visit!(visit_ts_type_query, TsTypeQuery);
        standard_only_visit!(visit_ts_type_query_expr, TsTypeQueryExpr);
        standard_only_visit!(visit_ts_type_ref, TsTypeRef);
        standard_only_visit!(
            visit_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        standard_only_visit!(visit_ts_union_type, TsUnionType);

        standard_only_visit!(visit_jsx_element, JSXElement);
        standard_only_visit!(visit_jsx_fragment, JSXFragment);
        standard_only_visit!(visit_jsx_empty_expr, JSXEmptyExpr);
        standard_only_visit!(visit_jsx_member_expr, JSXMemberExpr);
        standard_only_visit!(visit_jsx_namespaced_name, JSXNamespacedName);
    };
}

/// Mark visitor as ECMAScript standard only and mark other types as
/// unreachable.
///
/// Used to reduce the binary size.
#[macro_export]
macro_rules! standard_only_visit_mut {
    ($name:ident, $N:ident) => {
        fn $name(&mut self, _: &mut $crate::swc_ecma_ast::$N) {
            $crate::fail_not_standard()
        }
    };
    () => {
        standard_only_visit_mut!(visit_mut_accessibility, Accessibility);
        standard_only_visit_mut!(visit_mut_true_plus_minus, TruePlusMinus);
        standard_only_visit_mut!(visit_mut_ts_array_type, TsArrayType);
        standard_only_visit_mut!(visit_mut_ts_call_signature_decl, TsCallSignatureDecl);
        standard_only_visit_mut!(visit_mut_ts_conditional_type, TsConditionalType);
        standard_only_visit_mut!(
            visit_mut_ts_construct_signature_decl,
            TsConstructSignatureDecl
        );
        standard_only_visit_mut!(visit_mut_ts_constructor_type, TsConstructorType);
        standard_only_visit_mut!(visit_mut_ts_entity_name, TsEntityName);
        standard_only_visit_mut!(visit_mut_ts_expr_with_type_args, TsExprWithTypeArgs);
        standard_only_visit_mut!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);
        standard_only_visit_mut!(visit_mut_ts_fn_param, TsFnParam);
        standard_only_visit_mut!(visit_mut_ts_fn_type, TsFnType);
        standard_only_visit_mut!(visit_mut_ts_import_type, TsImportType);
        standard_only_visit_mut!(visit_mut_ts_index_signature, TsIndexSignature);
        standard_only_visit_mut!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);
        standard_only_visit_mut!(visit_mut_ts_infer_type, TsInferType);
        standard_only_visit_mut!(visit_mut_ts_interface_body, TsInterfaceBody);
        standard_only_visit_mut!(visit_mut_ts_interface_decl, TsInterfaceDecl);
        standard_only_visit_mut!(visit_mut_ts_intersection_type, TsIntersectionType);
        standard_only_visit_mut!(visit_mut_ts_keyword_type, TsKeywordType);
        standard_only_visit_mut!(visit_mut_ts_keyword_type_kind, TsKeywordTypeKind);
        standard_only_visit_mut!(visit_mut_ts_mapped_type, TsMappedType);
        standard_only_visit_mut!(visit_mut_ts_method_signature, TsMethodSignature);
        standard_only_visit_mut!(visit_mut_ts_optional_type, TsOptionalType);
        standard_only_visit_mut!(visit_mut_ts_parenthesized_type, TsParenthesizedType);
        standard_only_visit_mut!(visit_mut_ts_property_signature, TsPropertySignature);
        standard_only_visit_mut!(visit_mut_ts_qualified_name, TsQualifiedName);
        standard_only_visit_mut!(visit_mut_ts_rest_type, TsRestType);
        standard_only_visit_mut!(visit_mut_ts_this_type, TsThisType);
        standard_only_visit_mut!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);
        standard_only_visit_mut!(visit_mut_ts_tuple_type, TsTupleType);
        standard_only_visit_mut!(visit_mut_ts_type, TsType);
        standard_only_visit_mut!(visit_mut_ts_type_alias_decl, TsTypeAliasDecl);
        standard_only_visit_mut!(visit_mut_ts_type_ann, TsTypeAnn);
        standard_only_visit_mut!(visit_mut_ts_type_element, TsTypeElement);
        standard_only_visit_mut!(visit_mut_ts_type_lit, TsTypeLit);
        standard_only_visit_mut!(visit_mut_ts_type_operator, TsTypeOperator);
        standard_only_visit_mut!(visit_mut_ts_type_operator_op, TsTypeOperatorOp);
        standard_only_visit_mut!(visit_mut_ts_type_param, TsTypeParam);
        standard_only_visit_mut!(visit_mut_ts_type_param_decl, TsTypeParamDecl);
        standard_only_visit_mut!(
            visit_mut_ts_type_param_instantiation,
            TsTypeParamInstantiation
        );
        standard_only_visit_mut!(visit_mut_ts_type_predicate, TsTypePredicate);
        standard_only_visit_mut!(visit_mut_ts_type_query, TsTypeQuery);
        standard_only_visit_mut!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);
        standard_only_visit_mut!(visit_mut_ts_type_ref, TsTypeRef);
        standard_only_visit_mut!(
            visit_mut_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        standard_only_visit_mut!(visit_mut_ts_union_type, TsUnionType);

        standard_only_visit_mut!(visit_mut_jsx_element, JSXElement);
        standard_only_visit_mut!(visit_mut_jsx_fragment, JSXFragment);
        standard_only_visit_mut!(visit_mut_jsx_empty_expr, JSXEmptyExpr);
        standard_only_visit_mut!(visit_mut_jsx_member_expr, JSXMemberExpr);
        standard_only_visit_mut!(visit_mut_jsx_namespaced_name, JSXNamespacedName);
    };
}

/// Note: Ignoring more types is not considered as a breaking change.
#[macro_export]
macro_rules! noop_visit_mut_type {
    ($name:ident, $N:ident) => {
        fn $name(&mut self, _: &mut $crate::swc_ecma_ast::$N) {}
    };
    () => {
        noop_visit_mut_type!(visit_mut_accessibility, Accessibility);
        noop_visit_mut_type!(visit_mut_true_plus_minus, TruePlusMinus);
        noop_visit_mut_type!(visit_mut_ts_array_type, TsArrayType);
        noop_visit_mut_type!(visit_mut_ts_call_signature_decl, TsCallSignatureDecl);
        noop_visit_mut_type!(visit_mut_ts_conditional_type, TsConditionalType);
        noop_visit_mut_type!(
            visit_mut_ts_construct_signature_decl,
            TsConstructSignatureDecl
        );
        noop_visit_mut_type!(visit_mut_ts_constructor_type, TsConstructorType);
        noop_visit_mut_type!(visit_mut_ts_entity_name, TsEntityName);
        noop_visit_mut_type!(visit_mut_ts_expr_with_type_args, TsExprWithTypeArgs);
        noop_visit_mut_type!(visit_mut_ts_external_module_ref, TsExternalModuleRef);
        noop_visit_mut_type!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_visit_mut_type!(visit_mut_ts_fn_param, TsFnParam);
        noop_visit_mut_type!(visit_mut_ts_fn_type, TsFnType);
        noop_visit_mut_type!(visit_mut_ts_import_type, TsImportType);
        noop_visit_mut_type!(visit_mut_ts_index_signature, TsIndexSignature);
        noop_visit_mut_type!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);
        noop_visit_mut_type!(visit_mut_ts_infer_type, TsInferType);
        noop_visit_mut_type!(visit_mut_ts_interface_body, TsInterfaceBody);
        noop_visit_mut_type!(visit_mut_ts_interface_decl, TsInterfaceDecl);
        noop_visit_mut_type!(visit_mut_ts_intersection_type, TsIntersectionType);
        noop_visit_mut_type!(visit_mut_ts_keyword_type, TsKeywordType);
        noop_visit_mut_type!(visit_mut_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_visit_mut_type!(visit_mut_ts_mapped_type, TsMappedType);
        noop_visit_mut_type!(visit_mut_ts_method_signature, TsMethodSignature);
        noop_visit_mut_type!(visit_mut_ts_module_ref, TsModuleRef);
        noop_visit_mut_type!(visit_mut_ts_optional_type, TsOptionalType);
        noop_visit_mut_type!(visit_mut_ts_parenthesized_type, TsParenthesizedType);
        noop_visit_mut_type!(visit_mut_ts_property_signature, TsPropertySignature);
        noop_visit_mut_type!(visit_mut_ts_qualified_name, TsQualifiedName);
        noop_visit_mut_type!(visit_mut_ts_rest_type, TsRestType);
        noop_visit_mut_type!(visit_mut_ts_this_type, TsThisType);
        noop_visit_mut_type!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_visit_mut_type!(visit_mut_ts_tuple_type, TsTupleType);
        noop_visit_mut_type!(visit_mut_ts_type, TsType);
        noop_visit_mut_type!(visit_mut_ts_type_alias_decl, TsTypeAliasDecl);
        noop_visit_mut_type!(visit_mut_ts_type_ann, TsTypeAnn);
        noop_visit_mut_type!(visit_mut_ts_type_element, TsTypeElement);
        noop_visit_mut_type!(visit_mut_ts_type_lit, TsTypeLit);
        noop_visit_mut_type!(visit_mut_ts_type_operator, TsTypeOperator);
        noop_visit_mut_type!(visit_mut_ts_type_operator_op, TsTypeOperatorOp);
        noop_visit_mut_type!(visit_mut_ts_type_param, TsTypeParam);
        noop_visit_mut_type!(visit_mut_ts_type_param_decl, TsTypeParamDecl);
        noop_visit_mut_type!(
            visit_mut_ts_type_param_instantiation,
            TsTypeParamInstantiation
        );
        noop_visit_mut_type!(visit_mut_ts_type_predicate, TsTypePredicate);
        noop_visit_mut_type!(visit_mut_ts_type_query, TsTypeQuery);
        noop_visit_mut_type!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);
        noop_visit_mut_type!(visit_mut_ts_type_ref, TsTypeRef);
        noop_visit_mut_type!(
            visit_mut_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_visit_mut_type!(visit_mut_ts_union_type, TsUnionType);
    };
}

#[macro_export]
macro_rules! visit_obj_and_computed {
    () => {
        fn visit_member_expr(&mut self, n: &$crate::swc_ecma_ast::MemberExpr) {
            n.obj.visit_with(self);
            if let $crate::swc_ecma_ast::MemberProp::Computed(c) = &n.prop {
                c.visit_with(self);
            }
        }

        fn visit_jsx_member_expr(&mut self, n: &$crate::swc_ecma_ast::JSXMemberExpr) {
            n.obj.visit_with(self);
        }

        fn visit_super_prop_expr(&mut self, n: &$crate::swc_ecma_ast::SuperPropExpr) {
            if let $crate::swc_ecma_ast::SuperProp::Computed(c) = &n.prop {
                c.visit_with(self);
            }
        }
    };
}

#[macro_export]
macro_rules! visit_mut_obj_and_computed {
    () => {
        fn visit_mut_member_expr(&mut self, n: &mut $crate::swc_ecma_ast::MemberExpr) {
            n.obj.visit_mut_with(self);
            if let $crate::swc_ecma_ast::MemberProp::Computed(c) = &mut n.prop {
                c.visit_mut_with(self);
            }
        }

        fn visit_mut_jsx_member_expr(&mut self, n: &mut $crate::swc_ecma_ast::JSXMemberExpr) {
            n.obj.visit_mut_with(self);
        }

        fn visit_mut_super_prop_expr(&mut self, n: &mut $crate::swc_ecma_ast::SuperPropExpr) {
            if let $crate::swc_ecma_ast::SuperProp::Computed(c) = &mut n.prop {
                c.visit_mut_with(self);
            }
        }
    };
}
