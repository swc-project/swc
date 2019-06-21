use crate::ty::{Type, TypeRef};
use lazy_static::lazy_static;
use std::borrow::Cow;
use swc_atoms::{js_word, JsWord};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

macro_rules! decl {
    () => {};
}

lazy_static! {
    static ref OBJECT_TY: Type = {
        let members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
        .into()
    };
}

lazy_static! {
    static ref STRING_TY: Type = {
        let members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
        .into()
    };
}

lazy_static! {
    static ref ERROR_TY: Type = {
        let members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
        .into()
    };
}

lazy_static! {
    static ref SYMBOL_TY: Type = {
        let members = vec![];

        TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })
        .into()
    };
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Lib {
    Dom,
    Es5,
    Es2015Promise,
}

pub fn get(libs: &[Lib], sym: &JsWord) -> Option<TypeRef<'static>> {
    Some(Cow::Borrowed(match *sym {
        js_word!("Object") => &*OBJECT_TY,
        js_word!("String") => &*STRING_TY,
        js_word!("Error") => &*ERROR_TY,
        js_word!("Symbol") => &*SYMBOL_TY,

        _ => return None,
    }))
}
