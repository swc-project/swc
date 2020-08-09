use crate::{
    debug::print_backtrace, id::Id, ty, type_facts::TypeFacts, util::TypeEq, ModuleTypeInfo,
};
use bitflags::_core::iter::FusedIterator;
use is_macro::Is;
use std::{fmt::Debug, mem::transmute, sync::Arc};
use swc_atoms::{js_word, JsWord};
use swc_common::{FromVariant, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    Value,
    Value::{Known, Unknown},
};

mod convert;
mod generalize;
mod type_facts;

struct LitGeneralizer;

impl Fold<Ref> for LitGeneralizer {
    fn fold(&mut self, mut r: Ref) -> Ref {
        r.type_name = r.type_name.fold_with(self);

        r
    }
}

impl Fold<Type> for LitGeneralizer {
    fn fold(&mut self, mut ty: Type) -> Type {
        ty = ty.fold_children_with(self);

        match ty {
            Type::Lit(TsLitType { span, ref lit, .. }) => {
                return Type::Keyword(TsKeywordType {
                    span,
                    kind: match *lit {
                        TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                        TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                        TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                        TsLit::Tpl(..) => TsKeywordTypeKind::TsStringKeyword,
                    },
                })
            }
            _ => ty,
        }
    }
}

impl FoldType for LitGeneralizer {
    fn fold_function(&mut self, node: Function) -> Function {
        node
    }
}

pub trait TypeExt: Into<Type> {
    fn generalize_lit(self) -> Self {
        self.into().fold_with(&mut LitGeneralizer);
    }
}
