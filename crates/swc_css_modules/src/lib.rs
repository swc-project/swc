use swc_css_ast::{
    ComplexSelector, CompoundSelector, Declaration, PseudoClassSelector, SelectorList, Stylesheet,
};
use swc_css_parser::parser::ParserConfig;
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
    let mut compiler = Compiler {
        config,
        data: Default::default(),
    };

    ss.visit_mut_with(&mut compiler);
}

struct Compiler<C>
where
    C: Config,
{
    config: C,
    data: Data,
}

#[derive(Default)]
struct Data {
    current_selectors: Option<Vec<ComplexSelector>>,
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
        for sel in &mut n.children {
            let old = self.data.current_selectors.take();
            self.data.current_selectors = Some(vec![]);
            sel.visit_mut_with(self);
            self.data.current_selectors = old;
        }
    }

    /// Handle :local and :global
    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        n.visit_mut_children_with(self);

        if let Some(current) = &mut self.data.current_selectors {
            match &*n.name.value {
                "local" => {
                    if let Some(children) = &mut n.children {
                        let tokens = to_tokens_vec(&*children);

                        let sel = swc_css_parser::parse_tokens(
                            &tokens,
                            ParserConfig {
                                ..Default::default()
                            },
                            &mut vec![],
                        )
                        .unwrap();

                        current.push(sel);
                    }
                }
                "global" => {}

                _ => {}
            }
        }
    }
}
