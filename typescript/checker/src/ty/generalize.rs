use crate::{
    ty::{Array, Type},
    util::TypeEq,
};
use swc_common::{Fold, FoldWith, Spanned};

impl Type {
    pub fn generalize_tuple(self) -> Self {
        self.into_owned().fold_with(&mut TupleToArray)
    }
}

struct TupleToArray;

impl Fold<Type> for TupleToArray {
    fn fold(&mut self, ty: Type) -> Type {
        let ty: Type = ty.fold_children(self);
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
