use rustc_hash::FxHashMap;
use serde::Serialize;
use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, ComponentValue, CompoundSelector, Declaration,
    DeclarationName, DeclarationOrAtRule, Ident, KeyframesName, QualifiedRule,
    QualifiedRulePrelude, StyleBlock, Stylesheet, SubclassSelector,
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
    fn new_name_for(&self, local: &JsWord) -> JsWord;

    // /// Used for `@value` imports.
    // fn get_value(&self, import_source: &str, value_name: &JsWord) ->
    // ComponentValue;
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum CssClassName {
    Local {
        /// Tranformed css class name
        name: JsWord,
    },
    Global {
        name: JsWord,
    },
    Import {
        /// The exported class name. This is the value specified by the user.
        name: JsWord,
        /// The module specifier.
        from: JsWord,
    },
}

#[derive(Debug, Clone)]
pub struct TransformResult {
    /// A map of js class name to css class names.
    pub renamed: FxHashMap<JsWord, Vec<CssClassName>>,
}

/// Returns a map from local name to exported name.
pub fn compile(ss: &mut Stylesheet, config: impl TransformConfig) -> TransformResult {
    let mut compiler = Compiler {
        config,
        data: Default::default(),
        result: TransformResult {
            renamed: Default::default(),
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

    renamed_to_orig: FxHashMap<JsWord, JsWord>,
    orig_to_renamed: FxHashMap<JsWord, JsWord>,
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
                                let key = self
                                    .data
                                    .renamed_to_orig
                                    .get(&class_sel.text.value)
                                    .cloned();

                                if let Some(key) = key {
                                    self.result.renamed.entry(key).or_default().extend(composes);
                                }
                            }
                        }
                    }
                }
            }
        }

        self.data.composes_for_current = old_compose_stack;
    }

    fn visit_mut_component_values(&mut self, n: &mut Vec<ComponentValue>) {
        n.visit_mut_children_with(self);

        n.retain(|v| match v {
            ComponentValue::StyleBlock(StyleBlock::Declaration(d))
            | ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::Declaration(d)) => {
                if let DeclarationName::Ident(ident) = &d.name {
                    if &*ident.value == "composes" {
                        return false;
                    }
                }

                true
            }
            _ => true,
        });
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

                                return;
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
                                return;
                            }
                            _ => (),
                        }
                    }

                    for class_name in n.value.iter() {
                        if let ComponentValue::Ident(Ident { value, .. }) = class_name {
                            if let Some(value) = self.data.orig_to_renamed.get(value) {
                                composes_for_current.push(CssClassName::Local {
                                    name: value.clone(),
                                });
                            }
                        }
                    }
                }
            }
        }

        if let DeclarationName::Ident(name) = &n.name {
            match name.value.to_ascii_lowercase() {
                js_word!("animation") => {
                    for v in &mut n.value {
                        if let ComponentValue::Ident(Ident { value, raw, .. }) = v {
                            *raw = None;

                            rename(
                                &mut self.config,
                                &mut self.result,
                                &mut self.data.orig_to_renamed,
                                &mut self.data.renamed_to_orig,
                                value,
                            );
                            break;
                        }
                    }
                }
                js_word!("animation-name") => {
                    for v in &mut n.value {
                        if let ComponentValue::Ident(Ident { value, raw, .. }) = v {
                            *raw = None;

                            rename(
                                &mut self.config,
                                &mut self.result,
                                &mut self.data.orig_to_renamed,
                                &mut self.data.renamed_to_orig,
                                value,
                            );
                        }
                    }
                }
                _ => {}
            }
        }
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
    }

    fn visit_mut_compound_selector(&mut self, sel: &mut CompoundSelector) {
        let mut new_subclass = Vec::with_capacity(sel.subclass_selectors.len());

        for mut n in sel.subclass_selectors.take() {
            match &mut n {
                SubclassSelector::Class(..) | SubclassSelector::Id(..) => {
                    process_local(
                        &mut self.config,
                        &mut self.result,
                        &mut self.data.orig_to_renamed,
                        &mut self.data.renamed_to_orig,
                        &mut n,
                    );
                }
                SubclassSelector::PseudoClass(class_sel) => {
                    class_sel.visit_mut_with(self);

                    match &*class_sel.name.value {
                        "local" => {
                            if let Some(children) = &mut class_sel.children {
                                let tokens = to_tokens_vec(&*children);

                                let mut sel: CompoundSelector = swc_css_parser::parse_tokens(
                                    &tokens,
                                    ParserConfig {
                                        ..Default::default()
                                    },
                                    &mut vec![],
                                )
                                .unwrap();

                                for sel in &mut sel.subclass_selectors {
                                    process_local(
                                        &mut self.config,
                                        &mut self.result,
                                        &mut self.data.orig_to_renamed,
                                        &mut self.data.renamed_to_orig,
                                        sel,
                                    );
                                }
                                new_subclass.extend(sel.subclass_selectors);

                                continue;
                            }
                        }
                        "global" => {
                            if let Some(children) = &mut class_sel.children {
                                let tokens = to_tokens_vec(&*children);

                                let sel: CompoundSelector = swc_css_parser::parse_tokens(
                                    &tokens,
                                    ParserConfig {
                                        ..Default::default()
                                    },
                                    &mut vec![],
                                )
                                .unwrap();

                                new_subclass.extend(sel.subclass_selectors);

                                continue;
                            }
                        }

                        _ => {}
                    }
                }
                _ => {
                    n.visit_mut_children_with(self);
                }
            }

            new_subclass.push(n);
        }

        sel.subclass_selectors = new_subclass;
    }

    fn visit_mut_complex_selectors(&mut self, n: &mut Vec<ComplexSelector>) {
        n.visit_mut_children_with(self);

        n.retain_mut(|s| !s.children.is_empty());
    }

    fn visit_mut_keyframes_name(&mut self, n: &mut KeyframesName) {
        n.visit_mut_children_with(self);

        match n {
            KeyframesName::CustomIdent(n) => {
                n.raw = None;
                rename(
                    &mut self.config,
                    &mut self.result,
                    &mut self.data.orig_to_renamed,
                    &mut self.data.renamed_to_orig,
                    &mut n.value,
                )
            }
            KeyframesName::Str(n) => {
                n.raw = None;
                rename(
                    &mut self.config,
                    &mut self.result,
                    &mut self.data.orig_to_renamed,
                    &mut self.data.renamed_to_orig,
                    &mut n.value,
                )
            }
        }
    }
}

fn rename<C>(
    config: &mut C,
    result: &mut TransformResult,
    orig_to_renamed: &mut FxHashMap<JsWord, JsWord>,
    renamed_to_orig: &mut FxHashMap<JsWord, JsWord>,
    name: &mut JsWord,
) where
    C: TransformConfig,
{
    if let Some(renamed) = orig_to_renamed.get(name) {
        *name = renamed.clone();
        return;
    }

    let new = config.new_name_for(name);

    orig_to_renamed.insert(name.clone(), new.clone());
    renamed_to_orig.insert(new.clone(), name.clone());

    {
        let e = result.renamed.entry(name.clone()).or_default();

        let v = CssClassName::Local { name: new.clone() };
        if !e.contains(&v) {
            e.push(v);
        }
    }

    *name = new;
}

fn process_local<C>(
    config: &mut C,
    result: &mut TransformResult,
    orig_to_renamed: &mut FxHashMap<JsWord, JsWord>,
    renamed_to_orig: &mut FxHashMap<JsWord, JsWord>,
    sel: &mut SubclassSelector,
) where
    C: TransformConfig,
{
    match sel {
        SubclassSelector::Id(sel) => {
            sel.text.raw = None;

            rename(
                config,
                result,
                orig_to_renamed,
                renamed_to_orig,
                &mut sel.text.value,
            );
        }
        SubclassSelector::Class(sel) => {
            sel.text.raw = None;

            rename(
                config,
                result,
                orig_to_renamed,
                renamed_to_orig,
                &mut sel.text.value,
            );
        }
        SubclassSelector::Attribute(_) => {}
        SubclassSelector::PseudoClass(_) => {}
        SubclassSelector::PseudoElement(_) => {}
    }
}
