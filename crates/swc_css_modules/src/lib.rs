use swc_css_ast::Stylesheet;
use swc_css_visit::VisitMut;

pub mod imports;

/// Various configurations for the css modules.
///
/// This is a trait rather than a struct because api like `fn() -> String` is
/// too restricted and `Box<Fn() -> String` is (needlessly) slow.
pub trait Config {}

pub fn compile(ss: &mut Stylesheet, config: impl Config) {}

struct Compiler<C>
where
    C: Config,
{
    config: C,
}

impl<C> VisitMut for Compiler<C> where C: Config {}
