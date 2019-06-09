use lazy_static::lazy_static;
use swc_atoms::{js_word, JsWord};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

lazy_static! {
    static ref OBJECT_TY: TsType = {
        let mut members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
    };
}

lazy_static! {
    static ref STRING_TY: TsType = {
        let mut members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
    };
}

lazy_static! {
    static ref ERROR_TY: TsType = {
        let mut members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
    };
}

pub fn default(sym: &JsWord) -> Option<&'static TsType> {
    match *sym {
        js_word!("Object") => Some(&*OBJECT_TY),
        js_word!("String") => Some(&*STRING_TY),
        js_word!("Error") => Some(&*ERROR_TY),

        _ => None,
    }
}
