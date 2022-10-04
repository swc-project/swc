use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, CompoundSelector, Declaration, PseudoClassSelector,
    SelectorList, Stylesheet,
};
use swc_css_parser::parser::ParserConfig;
use swc_css_visit::{VisitMut, VisitMutWith};
use util::to_tokens::to_tokens_vec;

pub mod imports;
mod util;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Segment {
    Literal(JsWord),
    Name,
    Local,
    Hash,
}

/// Various configurations for the css modules.
///
/// This is a trait rather than a struct because api like `fn() -> String` is
/// too restricted and `Box<Fn() -> String` is (needlessly) slow.
pub trait Config {
    fn write_file_name(&self, to: &mut String);

    fn write_hash_of_file_name(&self, to: &mut String);

    /// Pattern for the class names.
    fn pattern(&self) -> &[Segment];
}

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
        let mut new = Vec::with_capacity(n.children.len());

        for sel in &mut n.children {
            let old = self.data.current_selectors.take();
            self.data.current_selectors = Some(vec![]);
            sel.visit_mut_with(self);

            if !sel.children.is_empty() {
                new.push(sel.take());
            }

            let cur = self.data.current_selectors.take();
            if let Some(cur) = cur {
                new.extend(cur);
            }

            self.data.current_selectors = old;
        }

        n.children = new;
    }

    fn visit_mut_complex_selector(&mut self, n: &mut ComplexSelector) {
        n.visit_mut_children_with(self);

        n.children.retain(|s| match s {
            ComplexSelectorChildren::CompoundSelector(s) => {
                s.nesting_selector.is_some()
                    || !s.subclass_selectors.is_empty()
                    || s.type_selector.is_some()
            }
            ComplexSelectorChildren::Combinator(..) => true,
        });

        process_local(&mut self.config, n);
    }

    fn visit_mut_compound_selector(&mut self, n: &mut CompoundSelector) {
        n.visit_mut_children_with(self);

        n.subclass_selectors.retain(|s| match s {
            swc_css_ast::SubclassSelector::PseudoClass(s) => s.name.value != js_word!(""),
            _ => true,
        });
    }

    fn visit_mut_complex_selectors(&mut self, n: &mut Vec<ComplexSelector>) {
        n.visit_mut_children_with(self);

        n.retain_mut(|s| !s.children.is_empty());
    }

    /// Handle :local and :global
    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        n.visit_mut_children_with(self);

        if let Some(current) = &mut self.data.current_selectors {
            match &*n.name.value {
                "local" => {
                    if let Some(children) = &mut n.children {
                        let tokens = to_tokens_vec(&*children);

                        let mut sel = swc_css_parser::parse_tokens(
                            &tokens,
                            ParserConfig {
                                ..Default::default()
                            },
                            &mut vec![],
                        )
                        .unwrap();

                        process_local(&mut self.config, &mut sel);

                        n.name.take();

                        current.push(sel);
                    }
                }
                "global" => {
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

                        n.name.take();

                        current.push(sel);
                    }
                }

                _ => {}
            }
        }
    }
}

fn process_local<C>(config: &mut C, sel: &mut ComplexSelector)
where
    C: Config,
{
    for children in &mut sel.children {
        if let ComplexSelectorChildren::CompoundSelector(sel) = children {
            for sel in &mut sel.subclass_selectors {
                if let swc_css_ast::SubclassSelector::Class(sel) = sel {
                    let pattern = config.pattern();

                    let mut buf = String::new();

                    for segment in pattern {
                        match segment {
                            Segment::Literal(lit) => buf.push_str(lit),
                            Segment::Name => config.write_file_name(&mut buf),
                            Segment::Local => buf.push_str(&sel.text.value),
                            Segment::Hash => config.write_hash_of_file_name(&mut buf),
                        }
                    }

                    sel.text.raw = None;
                    sel.text.value = buf.into();
                }
            }
        }
    }
}
