use rustc_hash::FxHashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, ComponentValue, CompoundSelector, Declaration,
    DeclarationName, Ident, PseudoClassSelector, SelectorList, Stylesheet,
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
/// # Note
///
/// This is a trait rather than a struct because api like `fn() -> String` is
/// too restricted and `Box<Fn() -> String` is (needlessly) slow.
pub trait TransformConfig {
    /// Creates a class name for the given `local_name`.
    fn get_class_name(&self, local: &JsWord) -> JsWord;

    /// Used for `@value` imports.
    fn get_value(&self, import_source: &str, value_name: &JsWord) -> ComponentValue;
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum CssClassName {
    Local {
        name: JsWord,
    },
    Global {
        name: JsWord,
    },
    Import {
        /// The exported class name
        name: JsWord,
        /// The module specifier.
        from: JsWord,
    },
}

#[derive(Debug, Clone)]
pub struct CompileResult {
    /// A map of js class name to css class names.
    pub classes: FxHashMap<JsWord, Vec<CssClassName>>,
}

/// Returns a map from local name to exported name.
pub fn compile(ss: &mut Stylesheet, config: impl TransformConfig) -> CompileResult {
    let mut compiler = Compiler {
        config,
        data: Default::default(),
        result: CompileResult {
            classes: Default::default(),
        },
    };

    ss.visit_mut_with(&mut compiler);

    compiler.result
}

struct Compiler<C>
where
    C: TransformConfig,
{
    config: C,
    data: Data,
    result: CompileResult,
}

#[derive(Default)]
struct Data {
    current_selectors: Option<Vec<ComplexSelector>>,
}

impl<C> VisitMut for Compiler<C>
where
    C: TransformConfig,
{
    /// Handles `composes`
    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        if let DeclarationName::Ident(name) = &n.name {
            if &*name.value == "composes" {
                // comoses: name from 'foo.css'
                if n.value.len() >= 3 {
                    match (&n.value[n.value.len() - 2], &n.value[n.value.len() - 1]) {
                        (
                            ComponentValue::Ident(Ident {
                                value: js_word!("from"),
                                ..
                            }),
                            ComponentValue::Str(import_source),
                        ) => {
                            for class_name in n.value.iter().take(n.value.len() - 2) {
                                if let ComponentValue::Ident(Ident { value, .. }) = class_name {
                                    self.result
                                        .classes
                                        .entry(name.value.clone())
                                        .or_default()
                                        .push(CssClassName::Import {
                                            name: value.clone(),
                                            from: import_source.value.clone(),
                                        });
                                }
                            }
                        }
                        (
                            ComponentValue::Ident(Ident {
                                value: js_word!("from"),
                                ..
                            }),
                            ComponentValue::Ident(Ident {
                                value: js_word!("global"),
                                ..
                            }),
                        ) => {
                            for class_name in n.value.iter().take(n.value.len() - 2) {
                                if let ComponentValue::Ident(Ident { value, .. }) = class_name {
                                    self.result
                                        .classes
                                        .entry(name.value.clone())
                                        .or_default()
                                        .push(CssClassName::Global {
                                            name: value.clone(),
                                        });
                                }
                            }
                        }
                        _ => (),
                    }
                }
            }
        }
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
    C: TransformConfig,
{
    for children in &mut sel.children {
        if let ComplexSelectorChildren::CompoundSelector(sel) = children {
            for sel in &mut sel.subclass_selectors {
                if let swc_css_ast::SubclassSelector::Class(sel) = sel {
                    let new = config.get_class_name(&sel.text.value);

                    sel.text.raw = None;
                    sel.text.value = new;
                }
            }
        }
    }
}
