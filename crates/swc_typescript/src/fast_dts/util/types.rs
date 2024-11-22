use swc_common::DUMMY_SP;
use swc_ecma_ast::{TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsType, TsTypeAnn};

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
