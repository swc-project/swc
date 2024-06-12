use swc_common::errors::HANDLER;
use swc_ecma_ast::*;
use swc_ecma_utils::for_each_binding_ident;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn no_dupe_args() -> Box<dyn Rule> {
    visitor_rule(NoDupeArgs::default())
}

#[derive(Debug, Default)]
struct NoDupeArgs {}

/// This has time complexity of O(n^2), but it's fine as the number of paramters
/// is usually small.
macro_rules! check {
    ($node:expr) => {{
        // This vector allocates only if there are duplicate parameters.
        // This is used to handle the case where the same parameter is used 3 or more
        // times.
        let mut done = vec![];

        let mut hash_mode = false;

        let mut i1 = 0;
        for_each_binding_ident($node, |id1| {
            i1 += 1;

            let mut i2 = 0;
            for_each_binding_ident($node, |id2| {
                i2 += 1;

                if hash_mode {
                    return;
                } else if i2 >= 100 {
                    // While iterating for the first `id1`, we detect that there are more than 100
                    // identifiers. We switch to hash mode.
                    hash_mode = true;
                    return;
                }

                if i1 >= i2 || done.contains(&i1) {
                    return;
                }

                if id1.span.ctxt == id2.span.ctxt && id1.sym == id2.sym {
                    done.push(i1);

                    HANDLER.with(|handler| {
                        handler
                            .struct_span_err(
                                id2.span,
                                &format!(
                                    "the name `{}` is bound more than once in this parameter list",
                                    id1.sym
                                ),
                            )
                            .span_label(id1.span, "previous definition here".to_string())
                            .span_label(id2.span, &"used as parameter more than once".to_string())
                            .emit();
                    });
                }
            })
        })
    }};
}

impl Visit for NoDupeArgs {
    noop_visit_type!();

    fn visit_function(&mut self, f: &Function) {
        check!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, f: &ArrowExpr) {
        check!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_constructor(&mut self, f: &Constructor) {
        check!(&f.params);

        f.visit_children_with(self);
    }
}
