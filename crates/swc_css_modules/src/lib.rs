use rustc_hash::FxHashMap;
use serde::Serialize;
use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, ComponentValue, CompoundSelector, Declaration,
    DeclarationName, Ident, PseudoClassSelector, QualifiedRule, QualifiedRulePrelude, SelectorList,
    Stylesheet, SubclassSelector,
};
use swc_css_parser::parser::ParserConfig;
use swc_css_visit::{VisitMut, VisitMutWith};
use util::to_tokens::to_tokens_vec;

pub mod imports;
mod util;

/// Various configurations for the css modules.
///
/// # Note
///
/// This is a trait rather than a struct because api like `fn() -> String` is
/// too restricted and `Box<Fn() -> String` is (needlessly) slow.
pub trait TransformConfig {
    /// Creates a class name for the given `local_name`.
    fn get_class_name(&self, local: &JsWord) -> JsWord;

    // /// Used for `@value` imports.
    // fn get_value(&self, import_source: &str, value_name: &JsWord) ->
    // ComponentValue;
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
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
pub struct TransformResult {
    /// A map of js class name to css class names.
    pub classes: FxHashMap<JsWord, Vec<CssClassName>>,
}

/// Returns a map from local name to exported name.
pub fn compile(ss: &mut Stylesheet, config: impl TransformConfig) -> TransformResult {
    let mut compiler = Compiler {
        config,
        data: Default::default(),
        result: TransformResult {
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
    result: TransformResult,
}

#[derive(Default)]
struct Data {
    /// Context for `composes`
    composes_for_current: Option<Vec<CssClassName>>,

    current_selectors: Option<Vec<ComplexSelector>>,
}

impl<C> VisitMut for Compiler<C>
where
    C: TransformConfig,
{
    fn visit_mut_qualified_rule(&mut self, n: &mut QualifiedRule) {
        let old_compose_stack = self.data.composes_for_current.take();
        self.data.composes_for_current = Some(Default::default());

        n.visit_mut_children_with(self);

        if let QualifiedRulePrelude::SelectorList(sel) = &n.prelude {
            //
            if sel.children.len() == 1 && sel.children[0].children.len() == 1 {
                if let ComplexSelectorChildren::CompoundSelector(sel) = &sel.children[0].children[0]
                {
                    if sel.subclass_selectors.len() == 1 {
                        if let SubclassSelector::Class(class_sel) = &sel.subclass_selectors[0] {
                            if let Some(composes) = self.data.composes_for_current.take() {
                                self.result
                                    .classes
                                    .entry(class_sel.text.value.clone())
                                    .or_default()
                                    .extend(composes);
                            }
                        }
                    }
                }
            }
        }

        self.data.composes_for_current = old_compose_stack;
    }

    /// Handles `composes`
    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        if let Some(composes_for_current) = &mut self.data.composes_for_current {
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
                                        composes_for_current.push(CssClassName::Import {
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
                                        composes_for_current.push(CssClassName::Global {
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

        process_local(&mut self.config, &mut self.result, n);
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

                        process_local(&mut self.config, &mut self.result, &mut sel);

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

fn process_local<C>(config: &mut C, result: &mut TransformResult, sel: &mut ComplexSelector)
where
    C: TransformConfig,
{
    for children in &mut sel.children {
        if let ComplexSelectorChildren::CompoundSelector(sel) = children {
            for sel in &mut sel.subclass_selectors {
                if let swc_css_ast::SubclassSelector::Class(sel) = sel {
                    let new = config.get_class_name(&sel.text.value);

                    result
                        .classes
                        .entry(sel.text.value.clone())
                        .or_default()
                        .push(CssClassName::Local { name: new.clone() });

                    sel.text.raw = None;
                    sel.text.value = new;
                }
            }
        }
    }
}
