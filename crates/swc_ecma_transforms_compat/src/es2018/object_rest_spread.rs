use std::{
    iter,
    mem::{self, replace},
};

use serde::Deserialize;
use swc_common::{chain, util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    helper, helper_expr,
    perf::{Check, Parallel},
};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, is_literal, private_ident, quote_ident, var::VarCollector,
    ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(config: Config) -> impl Fold + VisitMut {
    chain!(
        as_folder(ObjectRest {
            config,
            ..Default::default()
        }),
        as_folder(ObjectSpread { config })
    )
}
