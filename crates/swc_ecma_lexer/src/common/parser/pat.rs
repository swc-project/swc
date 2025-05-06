use swc_ecma_ast::{AssignPatProp, EsReserved, KeyValuePatProp, ObjectPatProp, Pat, RestPat};

use super::Parser;
use crate::error::SyntaxError;

/// argument of arrow is pattern, although idents in pattern is already
/// checked if is a keyword, it should also be checked if is arguments or
/// eval
pub(super) fn pat_is_valid_argument_in_strict<'a>(p: &mut impl Parser<'a>, pat: &Pat) {
    match pat {
        Pat::Ident(i) => {
            if i.is_reserved_in_strict_bind() {
                p.emit_strict_mode_err(i.span, SyntaxError::EvalAndArgumentsInStrict)
            }
        }
        Pat::Array(arr) => {
            for pat in arr.elems.iter().flatten() {
                pat_is_valid_argument_in_strict(p, pat)
            }
        }
        Pat::Rest(r) => pat_is_valid_argument_in_strict(p, &r.arg),
        Pat::Object(obj) => {
            for prop in obj.props.iter() {
                match prop {
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. })
                    | ObjectPatProp::Rest(RestPat { arg: value, .. }) => {
                        pat_is_valid_argument_in_strict(p, value)
                    }
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        if key.is_reserved_in_strict_bind() {
                            p.emit_strict_mode_err(key.span, SyntaxError::EvalAndArgumentsInStrict)
                        }
                    }
                }
            }
        }
        Pat::Assign(a) => pat_is_valid_argument_in_strict(p, &a.left),
        Pat::Invalid(_) | Pat::Expr(_) => (),
    }
}
