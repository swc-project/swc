use serde::Deserialize;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_utils::{quote_str, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn typeof_symbol(c: Config) -> impl Pass {
    if c.loose {
        None
    } else {
        let mut options = swc_ecma_transformer::Options::default();
        options.env.es2015.typeof_symbol = true;
        Some(options.into_pass())
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        Syntax::default(),
        |_| typeof_symbol(Config::default()),
        dont_touch_non_symbol_comparison,
        "typeof window !== 'undefined'"
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(Config::default()),
        dont_touch_non_symbol_comparison_02,
        "'undefined' !== typeof window"
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(Config::default()),
        issue_1843_1,
        "
        function isUndef(type) {
            return type === 'undefined';
        }

        var isWeb = !isUndef(typeof window) && 'onload' in window;
        exports.isWeb = isWeb;
        var isNode = !isUndef(typeof process) && !!(process.versions && process.versions.node);
        exports.isNode = isNode;
        var isWeex = !isUndef(typeof WXEnvironment) && WXEnvironment.platform !== 'Web';
        exports.isWeex = isWeex;
        "
    );

    test!(
        Syntax::default(),
        |_| typeof_symbol(Config { loose: true }),
        dont_touch_in_loose_mode,
        "typeof sym;"
    );
}
