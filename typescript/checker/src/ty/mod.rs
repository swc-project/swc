use self::{generalize::TupleToArray, type_facts::TypeFactsHandler};
use crate::type_facts::TypeFacts;
use swc_ecma_ast::{Bool, Number, Str, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType};
pub(crate) use swc_ts_types::*;

mod generalize;
mod type_facts;

struct LitGeneralizer;

impl Fold for LitGeneralizer {
    fn fold_ref(&mut self, mut r: Ref) -> Ref {
        r.type_name = r.type_name.fold_with(self);

        r
    }

    fn fold_type(&mut self, mut ty: Type) -> Type {
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
                        TsLit::BigInt(..) => TsKeywordTypeKind::TsBigIntKeyword,
                    },
                })
            }
            _ => ty,
        }
    }

    fn fold_function(&mut self, node: Function) -> Function {
        node
    }
}

pub trait TypeExt: Into<Type> {
    fn generalize_lit(self) -> Box<Type> {
        box self.into().fold_with(&mut LitGeneralizer);
    }

    fn generalize_tuple(self) -> Box<Type> {
        box self.into().fold_with(&mut TupleToArray)
    }

    fn apply_type_facts(self, facts: TypeFacts) -> Box<Type> {
        log::info!("Applying type facts");
        (box self.into()).fold_with(&mut TypeFactsHandler { facts })
    }
}

impl<T> TypeExt for T where T: Into<Type> {}
