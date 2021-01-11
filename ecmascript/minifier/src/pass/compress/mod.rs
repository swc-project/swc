use drop_console::drop_console;
use swc_common::chain;
use swc_common::pass::Optional;
use swc_common::pass::Repeat;
use swc_common::pass::Repeated;
use swc_ecma_transforms::optimization::simplify::expr_simplifier;
use swc_ecma_transforms::pass::RepeatedJsPass;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::Fold;
use swc_ecma_visit::VisitMut;

mod drop_console;

#[derive(Debug, Clone, Default)]
pub struct CompressorOptions {
    /// Should we simplify expressions?
    pub expr: bool,
    pub drop_console: bool,
}

pub fn compressor(options: &CompressorOptions) -> impl '_ + Fold {
    let console_remover = Optional {
        enabled: options.drop_console,
        visitor: drop_console(),
    };
    let expr_simplifier = Optional {
        enabled: options.expr,
        visitor: expr_simplifier(),
    };
    let compressor = Compressor { options };

    chain!(console_remover, expr_simplifier, as_folder(compressor))
}

#[derive(Debug)]
struct Compressor<'a> {
    options: &'a CompressorOptions,
}

impl VisitMut for Compressor<'_> {}
