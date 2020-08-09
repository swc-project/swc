use crate::{
    ty::{self, Array, Type},
    util::TypeEq,
};
use swc_common::Spanned;

pub(super) struct TupleToArray;

impl ty::Fold for TupleToArray {
    fn fold_type(&mut self, ty: Type) -> Type {
        let ty: Type = ty.fold_children_with(self);
        let span = ty.span();

        match ty {
            Type::Tuple(tuple) => {
                let mut types: Vec<Type> = vec![];

                for ty in tuple.types {
                    if types.iter().any(|item| item.type_eq(&ty)) {
                        continue;
                    }

                    types.push(ty);
                }

                let elem_type = box Type::union(types);
                return Type::Array(Array { span, elem_type });
            }

            _ => ty,
        }
    }
}
