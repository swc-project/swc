use crate::util::Optional;
use drop_console::drop_console;
use std::borrow::Cow;
use swc_common::chain;
use swc_common::pass::CompilerPass;
use swc_common::pass::Repeat;
use swc_common::pass::Repeated;
use swc_ecma_transforms::optimization::simplify::expr_simplifier;
use swc_ecma_transforms::pass::JsPass;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::VisitMut;

mod drop_console;

#[derive(Debug, Clone, Default)]
pub struct CompressorOptions {
    /// Should we simplify expressions?
    pub expr: bool,
    pub drop_console: bool,
}

pub fn compressor(options: &CompressorOptions) -> impl '_ + JsPass {
    let console_remover = Optional {
        enabled: options.drop_console,
        visitor: drop_console(),
    };
    let expr_simplifier = Optional {
        enabled: options.expr,
        visitor: expr_simplifier(),
    };
    let compressor = Compressor {
        options,
        changed: false,
    };

    let repeated_passes = Repeat::new(chain!(expr_simplifier, as_folder(compressor)));

    chain!(console_remover, repeated_passes)
}

#[derive(Debug)]
struct Compressor<'a> {
    options: &'a CompressorOptions,
    changed: bool,
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
    }
}

impl VisitMut for Compressor<'_> {}
