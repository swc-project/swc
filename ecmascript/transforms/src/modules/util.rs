use crate::util::ExprFactory;
use ast::*;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, SyntaxContext, DUMMY_SP};

pub(super) fn make_require_call(src: Str) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("require").as_callee(),
        args: vec![Lit::Str(src).as_arg()],

        type_args: Default::default(),
    })
}

pub(super) fn local_name_for_src(src: &Str) -> JsWord {
    if !src.value.contains("/") {
        return format!("_{}", src.value).into();
    }

    unimplemented!()
}
