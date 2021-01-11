use crate::util::Optional;
use drop_console::drop_console;
use serde::Deserialize;
use std::borrow::Cow;
use swc_common::chain;
use swc_common::pass::CompilerPass;
use swc_common::pass::Repeat;
use swc_common::pass::Repeated;
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::expr_simplifier;
use swc_ecma_transforms::pass::JsPass;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod drop_console;

#[derive(Debug, Clone, Default, Deserialize)]
pub struct CompressOptions {
    /// Should we simplify expressions?
    pub expr: bool,
    pub drop_console: bool,
    pub reduce_vars: bool,
}

pub fn compressor(options: &CompressOptions) -> impl '_ + JsPass {
    let console_remover = Optional {
        enabled: options.drop_console,
        visitor: drop_console(),
    };
    let expr_pass = Optional {
        enabled: options.expr,
        visitor: expr_simplifier(),
    };
    let compressor = Compressor {
        options,
        pass: 0,
        changed: false,
    };

    let repeated_passes = Repeat::new(chain!(expr_pass, as_folder(compressor)));

    chain!(
        console_remover,
        repeated_passes,
        Optional {
            enabled: options.expr,
            visitor: expr_simplifier(),
        }
    )
}

#[derive(Debug)]
struct Compressor<'a> {
    options: &'a CompressOptions,
    changed: bool,
    pass: usize,
}

impl CompilerPass for Compressor<'_> {
    fn name() -> Cow<'static, str> {
        "compressor".into()
    }
}

impl Repeated for Compressor<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
        self.pass += 1;
    }
}

impl VisitMut for Compressor<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        if self.pass > 0 || self.options.reduce_vars {
            // reset_opt_flags
        }

        n.visit_mut_children_with(self);
    }
}
