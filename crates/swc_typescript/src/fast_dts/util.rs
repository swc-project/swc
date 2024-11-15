use swc_ecma_ast::{Pat, TsTypeAnn};

pub trait PatExt {
    fn get_type_ann(&self) -> &Option<Box<TsTypeAnn>>;
    fn set_type_ann(&mut self, type_anno: Option<Box<TsTypeAnn>>);
    fn with_type_ann<T, F: Fn(&Option<Box<TsTypeAnn>>) -> T>(&self, f: F) -> Option<T>;
    fn with_type_ann_mut<T, F: Fn(&mut Option<Box<TsTypeAnn>>) -> T>(&mut self, f: F) -> Option<T>;
}

impl PatExt for Pat {
    fn get_type_ann(&self) -> &Option<Box<TsTypeAnn>> {
        let pat = match self {
            Pat::Assign(assign_pat) => &assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => &binding_ident.type_ann,
            Pat::Array(array_pat) => &array_pat.type_ann,
            Pat::Rest(rest_pat) => &rest_pat.type_ann,
            Pat::Object(object_pat) => &object_pat.type_ann,
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => &None,
        }
    }

    fn set_type_ann(&mut self, type_anno: Option<Box<TsTypeAnn>>) {
        let pat = match self {
            Pat::Assign(assign_pat) => &mut assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => binding_ident.type_ann = type_anno,
            Pat::Array(array_pat) => array_pat.type_ann = type_anno,
            Pat::Rest(rest_pat) => rest_pat.type_ann = type_anno,
            Pat::Object(object_pat) => object_pat.type_ann = type_anno,
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => {}
        }
    }

    fn with_type_ann<T, F: Fn(&Option<Box<TsTypeAnn>>) -> T>(&self, f: F) -> Option<T> {
        let pat = match self {
            Pat::Assign(assign_pat) => &assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => Some(f(&binding_ident.type_ann)),
            Pat::Array(array_pat) => Some(f(&array_pat.type_ann)),
            Pat::Rest(rest_pat) => Some(f(&rest_pat.type_ann)),
            Pat::Object(object_pat) => Some(f(&object_pat.type_ann)),
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => None,
        }
    }

    fn with_type_ann_mut<T, F: Fn(&mut Option<Box<TsTypeAnn>>) -> T>(&mut self, f: F) -> Option<T> {
        let pat = match self {
            Pat::Assign(assign_pat) => &mut assign_pat.left,
            _ => self,
        };

        match pat {
            Pat::Ident(binding_ident) => Some(f(&mut binding_ident.type_ann)),
            Pat::Array(array_pat) => Some(f(&mut array_pat.type_ann)),
            Pat::Rest(rest_pat) => Some(f(&mut rest_pat.type_ann)),
            Pat::Object(object_pat) => Some(f(&mut object_pat.type_ann)),
            Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => None,
        }
    }
}
