use swc_common::pass::CompilerPass;
pub use swc_common::pass::{Optional, Repeated};
use swc_ecma_ast::{Module, Script};
use swc_ecma_visit::Fold;

pub fn noop() -> impl Fold {
    Noop
}

struct Noop;
impl Fold for Noop {
    #[inline(always)]
    fn fold_module(&mut self, m: Module) -> Module {
        m
    }
    #[inline(always)]
    fn fold_script(&mut self, s: Script) -> Script {
        s
    }
}

pub trait JsPass: CompilerPass + Fold {}

impl<T: ?Sized> JsPass for T where T: CompilerPass + Fold {}

pub trait RepeatedJsPass: Repeated + JsPass {}

impl<T: ?Sized> RepeatedJsPass for T where T: Repeated + JsPass {}
