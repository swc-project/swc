use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, ObjectPatProp, Pat, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsType,
    TsTypeAnn,
};

pub trait PatExt {
    fn get_type_ann(&self) -> &Option<Box<TsTypeAnn>>;
    fn set_type_ann(&mut self, type_anno: Option<Box<TsTypeAnn>>);
    fn bound_names<F: FnMut(&BindingIdent)>(&self, f: &mut F);
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

    fn bound_names<F: FnMut(&BindingIdent)>(&self, f: &mut F) {
        match self {
            Pat::Ident(binding_ident) => f(binding_ident),
            Pat::Array(array_pat) => {
                for pat in array_pat.elems.iter().flatten() {
                    pat.bound_names(f);
                }
            }
            Pat::Rest(rest_pat) => rest_pat.arg.bound_names(f),
            Pat::Object(object_pat) => {
                for pat in &object_pat.props {
                    match pat {
                        ObjectPatProp::KeyValue(key_value_pat_prop) => {
                            key_value_pat_prop.value.bound_names(f)
                        }
                        ObjectPatProp::Assign(assign_pat_prop) => f(&assign_pat_prop.key),
                        ObjectPatProp::Rest(rest_pat) => rest_pat.arg.bound_names(f),
                    }
                }
            }
            Pat::Assign(assign_pat) => assign_pat.left.bound_names(f),
            Pat::Invalid(_) | Pat::Expr(_) => todo!(),
        }
    }
}

pub fn any_type_ann() -> Box<TsTypeAnn> {
    type_ann(ts_keyword_type(TsKeywordTypeKind::TsAnyKeyword))
}

pub fn type_ann(ts_type: Box<TsType>) -> Box<TsTypeAnn> {
    Box::new(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: ts_type,
    })
}

pub fn ts_keyword_type(kind: TsKeywordTypeKind) -> Box<TsType> {
    Box::new(TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind,
    }))
}

pub fn ts_lit_type(lit: TsLit) -> Box<TsType> {
    Box::new(TsType::TsLitType(TsLitType {
        span: DUMMY_SP,
        lit,
    }))
}
