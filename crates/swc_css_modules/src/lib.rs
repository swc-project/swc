#![feature(box_patterns)]

use rustc_hash::FxHashMap;
use serde::Serialize;
use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, ComponentValue, Declaration, DeclarationName,
    Delimiter, DelimiterValue, FunctionName, Ident, KeyframesName, PseudoClassSelectorChildren,
    QualifiedRule, QualifiedRulePrelude, Stylesheet, SubclassSelector,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub mod imports;

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
        name: Ident,
    },
    Global {
        name: Ident,
    },
    Import {
        /// The exported class name. This is the value specified by the user.
        name: Ident,
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
pub fn compile<'a>(ss: &mut Stylesheet, config: impl 'a + TransformConfig) -> TransformResult {
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

    is_global_mode: bool,
    is_in_local_pseudo_class: bool,
}

impl<C> VisitMut for Compiler<C>
where
    C: TransformConfig,
{
    // TODO handle `@counter-style`, CSS modules doesn't support it, but we should
    // to fix it
    fn visit_mut_keyframes_name(&mut self, n: &mut KeyframesName) {
        match n {
            KeyframesName::CustomIdent(n) if !self.data.is_global_mode => {
                n.raw = None;

                rename(
                    &mut self.config,
                    &mut self.result,
                    &mut self.data.orig_to_renamed,
                    &mut self.data.renamed_to_orig,
                    &mut n.value,
                );
            }
            KeyframesName::Str(n) if !self.data.is_global_mode => {
                n.raw = None;

                rename(
                    &mut self.config,
                    &mut self.result,
                    &mut self.data.orig_to_renamed,
                    &mut self.data.renamed_to_orig,
                    &mut n.value,
                );
            }
            KeyframesName::PseudoFunction(pseudo_function)
                if pseudo_function.pseudo.value == js_word!("local") =>
            {
                match &pseudo_function.name {
                    KeyframesName::CustomIdent(custom_ident) => {
                        *n = KeyframesName::CustomIdent(custom_ident.clone());
                    }
                    KeyframesName::Str(string) => {
                        *n = KeyframesName::Str(string.clone());
                    }
                    _ => {
                        unreachable!();
                    }
                }

                n.visit_mut_with(self);

                return;
            }
            KeyframesName::PseudoPrefix(pseudo_prefix)
                if pseudo_prefix.pseudo.value == js_word!("local") =>
            {
                match &pseudo_prefix.name {
                    KeyframesName::CustomIdent(custom_ident) => {
                        *n = KeyframesName::CustomIdent(custom_ident.clone());
                    }
                    KeyframesName::Str(string) => {
                        *n = KeyframesName::Str(string.clone());
                    }
                    _ => {
                        unreachable!();
                    }
                }

                n.visit_mut_with(self);

                return;
            }
            KeyframesName::PseudoFunction(pseudo_function)
                if pseudo_function.pseudo.value == js_word!("global") =>
            {
                match &pseudo_function.name {
                    KeyframesName::CustomIdent(custom_ident) => {
                        *n = KeyframesName::CustomIdent(custom_ident.clone());
                    }
                    KeyframesName::Str(string) => {
                        *n = KeyframesName::Str(string.clone());
                    }
                    _ => {
                        unreachable!();
                    }
                }

                return;
            }
            KeyframesName::PseudoPrefix(pseudo_prefix)
                if pseudo_prefix.pseudo.value == js_word!("global") =>
            {
                match &pseudo_prefix.name {
                    KeyframesName::CustomIdent(custom_ident) => {
                        *n = KeyframesName::CustomIdent(custom_ident.clone());
                    }
                    KeyframesName::Str(string) => {
                        *n = KeyframesName::Str(string.clone());
                    }
                    _ => {
                        unreachable!();
                    }
                }

                return;
            }
            _ => {}
        }

        n.visit_mut_children_with(self);
    }

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
            ComponentValue::Declaration(d) => {
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
                    // composes: name from 'foo.css'
                    if n.value.len() >= 3 {
                        match (&n.value[n.value.len() - 2], &n.value[n.value.len() - 1]) {
                            (
                                ComponentValue::Ident(box Ident {
                                    value: js_word!("from"),
                                    ..
                                }),
                                ComponentValue::Str(import_source),
                            ) => {
                                for class_name in n.value.iter().take(n.value.len() - 2) {
                                    if let ComponentValue::Ident(box Ident { value, .. }) =
                                        class_name
                                    {
                                        composes_for_current.push(CssClassName::Import {
                                            name: value.clone(),
                                            from: import_source.value.clone(),
                                        });
                                    }
                                }

                                return;
                            }
                            (
                                ComponentValue::Ident(box Ident {
                                    value: js_word!("from"),
                                    ..
                                }),
                                ComponentValue::Ident(box Ident {
                                    value: js_word!("global"),
                                    ..
                                }),
                            ) => {
                                for class_name in n.value.iter().take(n.value.len() - 2) {
                                    if let ComponentValue::Ident(box Ident { value, .. }) =
                                        class_name
                                    {
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
                        if let ComponentValue::Ident(box Ident { value, .. }) = class_name {
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
            match name.value {
                js_word!("animation") => {
                    let mut can_change = true;

                    let mut iteration_count_visited = false;
                    let mut fill_mode_visited = false;
                    let mut direction_visited = false;
                    let mut easing_function_visited = false;
                    let mut play_state_visited = false;

                    for v in &mut n.value {
                        match v {
                            ComponentValue::Ident(box Ident { value, raw, .. }) => {
                                if !can_change {
                                    continue;
                                }

                                match *value {
                                    // iteration-count
                                    js_word!("infinite") => {
                                        if !iteration_count_visited {
                                            iteration_count_visited = true;
                                            continue;
                                        }
                                    }
                                    // fill-mode
                                    // NOTE: `animation: none:` will be trapped here
                                    js_word!("none")
                                    | js_word!("forwards")
                                    | js_word!("backwards")
                                    | js_word!("both") => {
                                        if !fill_mode_visited {
                                            fill_mode_visited = true;
                                            continue;
                                        }
                                    }
                                    // direction
                                    js_word!("normal")
                                    | js_word!("reverse")
                                    | js_word!("alternate")
                                    | js_word!("alternate-reverse") => {
                                        if !direction_visited {
                                            direction_visited = true;
                                            continue;
                                        }
                                    }
                                    // easing-function
                                    js_word!("linear")
                                    | js_word!("ease")
                                    | js_word!("ease-in")
                                    | js_word!("ease-out")
                                    | js_word!("ease-in-out")
                                    | js_word!("step-start")
                                    | js_word!("step-end") => {
                                        if !easing_function_visited {
                                            easing_function_visited = true;
                                            continue;
                                        }
                                    }
                                    // play-state
                                    js_word!("running") | js_word!("paused") => {
                                        if !play_state_visited {
                                            play_state_visited = true;
                                            continue;
                                        }
                                    }
                                    _ => {}
                                }

                                *raw = None;

                                rename(
                                    &mut self.config,
                                    &mut self.result,
                                    &mut self.data.orig_to_renamed,
                                    &mut self.data.renamed_to_orig,
                                    value,
                                );
                                can_change = false;
                            }
                            ComponentValue::Integer(_) => {
                                iteration_count_visited = true;
                            }
                            ComponentValue::Function(f) => {
                                if let FunctionName::Ident(ident) = &f.name {
                                    match ident.value {
                                        // easing-function
                                        js_word!("steps")
                                        | js_word!("cubic-bezier")
                                        | js_word!("linear") => {
                                            easing_function_visited = true;
                                        }
                                        _ => {
                                            // should be syntax error
                                        }
                                    }
                                }
                            }
                            ComponentValue::Delimiter(delimiter) => {
                                if matches!(
                                    &**delimiter,
                                    Delimiter {
                                        value: DelimiterValue::Comma,
                                        ..
                                    }
                                ) {
                                    can_change = true;

                                    // reset all flags
                                    iteration_count_visited = false;
                                    fill_mode_visited = false;
                                    direction_visited = false;
                                    easing_function_visited = false;
                                    play_state_visited = false;
                                }
                            }
                            _ => (),
                        }
                    }
                }
                js_word!("animation-name") => {
                    for v in &mut n.value {
                        if let ComponentValue::Ident(box Ident { value, raw, .. }) = v {
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
        let mut new_children = Vec::with_capacity(n.children.len());

        let old_is_global_mode = self.data.is_global_mode;

        'complex: for mut n in n.children.take() {
            if let ComplexSelectorChildren::CompoundSelector(selector) = &mut n {
                for (sel_index, sel) in selector.subclass_selectors.iter_mut().enumerate() {
                    match sel {
                        SubclassSelector::Class(..) | SubclassSelector::Id(..) => {
                            if !self.data.is_global_mode {
                                process_local(
                                    &mut self.config,
                                    &mut self.result,
                                    &mut self.data.orig_to_renamed,
                                    &mut self.data.renamed_to_orig,
                                    sel,
                                );
                            }
                        }
                        SubclassSelector::PseudoClass(class_sel) => match &*class_sel.name.value {
                            "local" => {
                                if let Some(children) = &mut class_sel.children {
                                    if let Some(PseudoClassSelectorChildren::ComplexSelector(
                                        complex_selector,
                                    )) = children.get_mut(0)
                                    {
                                        let old_is_global_mode = self.data.is_global_mode;
                                        let old_inside = self.data.is_global_mode;

                                        self.data.is_global_mode = false;
                                        self.data.is_in_local_pseudo_class = true;

                                        complex_selector.visit_mut_with(self);

                                        let mut complex_selector_children =
                                            complex_selector.children.clone();
                                        prepend_left_subclass_selectors(
                                            &mut complex_selector_children,
                                            selector
                                                .subclass_selectors
                                                .split_at(sel_index)
                                                .0
                                                .to_vec(),
                                        );
                                        new_children.extend(complex_selector_children);

                                        self.data.is_global_mode = old_is_global_mode;
                                        self.data.is_in_local_pseudo_class = old_inside;
                                    }
                                } else {
                                    self.data.is_global_mode = false;
                                }

                                continue 'complex;
                            }
                            "global" => {
                                if let Some(children) = &mut class_sel.children {
                                    if let Some(PseudoClassSelectorChildren::ComplexSelector(
                                        complex_selector,
                                    )) = children.get_mut(0)
                                    {
                                        let mut complex_selector_children =
                                            complex_selector.children.clone();
                                        prepend_left_subclass_selectors(
                                            &mut complex_selector_children,
                                            selector
                                                .subclass_selectors
                                                .split_at(sel_index)
                                                .0
                                                .to_vec(),
                                        );
                                        new_children.extend(complex_selector_children);
                                    }
                                } else {
                                    self.data.is_global_mode = true;
                                }

                                continue 'complex;
                            }
                            _ => {}
                        },
                        _ => {}
                    }
                }
            }

            new_children.push(n);
        }

        n.children = new_children;

        self.data.is_global_mode = old_is_global_mode;

        if self.data.is_in_local_pseudo_class {
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_complex_selectors(&mut self, n: &mut Vec<ComplexSelector>) {
        n.visit_mut_children_with(self);

        n.retain_mut(|s| !s.children.is_empty());
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

fn prepend_left_subclass_selectors(
    complex_selector_children: &mut [ComplexSelectorChildren],
    left_sels: Vec<SubclassSelector>,
) {
    if let Some(ComplexSelectorChildren::CompoundSelector(first)) =
        complex_selector_children.get_mut(0)
    {
        first.subclass_selectors = [left_sels, first.subclass_selectors.take()].concat();
    }
}
