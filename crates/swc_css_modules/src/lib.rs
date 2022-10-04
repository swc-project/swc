use swc_css_ast::{Declaration, PseudoClassSelector, SelectorList, Stylesheet};
use swc_css_visit::{VisitMut, VisitMutWith};
use util::to_tokens::to_tokens_vec;

pub mod imports;
mod util;

/// Various configurations for the css modules.
///
/// This is a trait rather than a struct because api like `fn() -> String` is
/// too restricted and `Box<Fn() -> String` is (needlessly) slow.
pub trait Config {}

pub fn compile(ss: &mut Stylesheet, config: impl Config) {
    let mut compiler = Compiler { config };

    ss.visit_mut_with(&mut compiler);
}

struct Compiler<C>
where
    C: Config,
{
    config: C,
}

impl<C> VisitMut for Compiler<C>
where
    C: Config,
{
    /// Handles `composes`
    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        // TODO: Handle composes
    }

    fn visit_mut_selector_list(&mut self, n: &mut SelectorList) {
        n.visit_mut_children_with(self);

        for sel in &mut n.children {
            dbg!(&*sel);
        }
    }

    /// Handle :local and :global
    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        n.visit_mut_children_with(self);

        match &*n.name.value {
            "local" => {
                if let Some(children) = &mut n.children {
                    let tokens = to_tokens_vec(&*children);
                }
            }
            "global" => {}

            _ => {}
        }
    }
}
