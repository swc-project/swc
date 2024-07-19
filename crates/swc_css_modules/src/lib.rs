use rustc_hash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{util::take::Take, Span};
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

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
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

    fn add(result: &mut TransformResult, data: &Data, key: &JsWord, composes: &[CssClassName]) {
        let mut extra_classes = Vec::new();
        {
            let class_names = result.renamed.entry(key.clone()).or_default();

            class_names.extend(composes.iter().cloned());
        }

        for composed_class_name in composes.iter() {
            if let CssClassName::Local { name } = composed_class_name {
                if let Some(original_class_name) = data.renamed_to_orig.get(&name.value) {
                    extra_classes.extend(
                        result
                            .renamed
                            .entry(original_class_name.clone())
                            .or_default()
                            .split_at(1)
                            .1
                            .to_vec(),
                    );
                }
            }
        }

        {
            let class_names = result.renamed.entry(key.clone()).or_default();

            class_names.extend(extra_classes);
        }
    }

    let composes = compiler.data.composes_inherit.take();

    for (key, composes) in &composes {
        add(&mut compiler.result, &compiler.data, key, composes);
    }
    for (key, composes) in &composes {
        add(&mut compiler.result, &compiler.data, key, composes);
    }
    compiler.result.renamed.iter_mut().for_each(|(_, v)| {
        v.sort();
        v.dedup();
    });

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
    composes_inherit: Vec<(JsWord, Vec<CssClassName>)>,

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
                    n.span,
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
                    n.span,
                    &mut self.config,
                    &mut self.result,
                    &mut self.data.orig_to_renamed,
                    &mut self.data.renamed_to_orig,
                    &mut n.value,
                );
            }
            KeyframesName::PseudoFunction(pseudo_function)
                if pseudo_function.pseudo.value == "local" =>
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
            KeyframesName::PseudoPrefix(pseudo_prefix) if pseudo_prefix.pseudo.value == "local" => {
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
                if pseudo_function.pseudo.value == "global" =>
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
                if pseudo_prefix.pseudo.value == "global" =>
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
            let composes = self.data.composes_for_current.take();

            for child in &sel.children {
                if let ComplexSelectorChildren::CompoundSelector(sel) = &child.children[0] {
                    for subclass_sel in &sel.subclass_selectors {
                        if let SubclassSelector::Class(class_sel) = &subclass_sel {
                            if let Some(composes) = &composes {
                                let key = self
                                    .data
                                    .renamed_to_orig
                                    .get(&class_sel.text.value)
                                    .cloned();

                                if let Some(key) = key {
                                    self.data.composes_inherit.push((key, composes.clone()));
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
                            (ComponentValue::Ident(ident), ComponentValue::Str(import_source))
                                if ident.value == "from" =>
                            {
                                for class_name in n.value.iter().take(n.value.len() - 2) {
                                    if let ComponentValue::Ident(value) = class_name {
                                        composes_for_current.push(CssClassName::Import {
                                            name: *value.clone(),
                                            from: import_source.value.clone(),
                                        });
                                    }
                                }

                                return;
                            }
                            (ComponentValue::Ident(from), ComponentValue::Ident(global))
                                if from.value == "from" && global.value == "global" =>
                            {
                                for class_name in n.value.iter().take(n.value.len() - 2) {
                                    if let ComponentValue::Ident(value) = class_name {
                                        composes_for_current.push(CssClassName::Global {
                                            name: *value.clone(),
                                        });
                                    }
                                }
                                return;
                            }
                            _ => (),
                        }
                    }

                    for class_name in n.value.iter_mut() {
                        if let ComponentValue::Ident(ident) = class_name {
                            let Ident { span, value, .. } = &mut **ident;
                            let orig = value.clone();
                            rename(
                                *span,
                                &mut self.config,
                                &mut self.result,
                                &mut self.data.orig_to_renamed,
                                &mut self.data.renamed_to_orig,
                                value,
                            );

                            if let Some(new_name) = self.data.orig_to_renamed.get(&orig) {
                                composes_for_current.push(CssClassName::Local {
                                    name: Ident {
                                        span: *span,
                                        value: new_name.clone(),
                                        raw: None,
                                    },
                                });
                            }
                        }
                    }
                }
            }
        }

        if let DeclarationName::Ident(name) = &n.name {
            match &*name.value {
                "animation" => {
                    let mut can_change = true;

                    let mut iteration_count_visited = false;
                    let mut fill_mode_visited = false;
                    let mut direction_visited = false;
                    let mut easing_function_visited = false;
                    let mut play_state_visited = false;

                    for v in &mut n.value {
                        match v {
                            ComponentValue::Ident(ident) => {
                                if !can_change {
                                    continue;
                                }

                                let Ident {
                                    span, value, raw, ..
                                } = &mut **ident;

                                match &**value {
                                    // iteration-count
                                    "infinite" => {
                                        if !iteration_count_visited {
                                            iteration_count_visited = true;
                                            continue;
                                        }
                                    }
                                    // fill-mode
                                    // NOTE: `animation: none:` will be trapped here
                                    "none" | "forwards" | "backwards" | "both" => {
                                        if !fill_mode_visited {
                                            fill_mode_visited = true;
                                            continue;
                                        }
                                    }
                                    // direction
                                    "normal" | "reverse" | "alternate" | "alternate-reverse" => {
                                        if !direction_visited {
                                            direction_visited = true;
                                            continue;
                                        }
                                    }
                                    // easing-function
                                    "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out"
                                    | "step-start" | "step-end" => {
                                        if !easing_function_visited {
                                            easing_function_visited = true;
                                            continue;
                                        }
                                    }
                                    // play-state
                                    "running" | "paused" => {
                                        if !play_state_visited {
                                            play_state_visited = true;
                                            continue;
                                        }
                                    }
                                    _ => {}
                                }

                                *raw = None;

                                rename(
                                    *span,
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
                                    match &*ident.value {
                                        // easing-function
                                        "steps" | "cubic-bezier" | "linear" => {
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
                "animation-name" => {
                    for v in &mut n.value {
                        if let ComponentValue::Ident(ident) = v {
                            let Ident {
                                span, value, raw, ..
                            } = &mut **ident;
                            *raw = None;

                            rename(
                                *span,
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
                for sel in selector.subclass_selectors.iter_mut() {
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

                        _ => {}
                    }
                }

                for (sel_index, sel) in selector.subclass_selectors.iter_mut().enumerate() {
                    if let SubclassSelector::PseudoClass(class_sel) = sel {
                        match &*class_sel.name.value {
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
                                            &mut selector.subclass_selectors,
                                            sel_index,
                                        );
                                        new_children.extend(complex_selector_children);

                                        self.data.is_global_mode = old_is_global_mode;
                                        self.data.is_in_local_pseudo_class = old_inside;
                                    }
                                } else {
                                    if sel_index > 0 {
                                        if let Some(n) = n.as_mut_compound_selector() {
                                            n.subclass_selectors.remove(sel_index);
                                        }
                                        new_children.push(n);
                                    }
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
                                            &mut selector.subclass_selectors,
                                            sel_index,
                                        );
                                        new_children.extend(complex_selector_children);
                                    }
                                } else {
                                    if sel_index > 0 {
                                        if let Some(n) = n.as_mut_compound_selector() {
                                            n.subclass_selectors.remove(sel_index);
                                        }
                                        new_children.push(n);
                                    }
                                    self.data.is_global_mode = true;
                                }

                                continue 'complex;
                            }
                            _ => {}
                        }
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
    span: Span,
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

        let v = CssClassName::Local {
            name: Ident {
                span,
                value: new.clone(),
                raw: None,
            },
        };
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
                sel.span,
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
                sel.span,
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
    sels: &mut Vec<SubclassSelector>,
    mut sel_index: usize,
) {
    sels.remove(sel_index);

    for c in complex_selector_children
        .iter_mut()
        .filter_map(|c| c.as_mut_compound_selector())
    {
        c.subclass_selectors.splice(0..0, sels.drain(..sel_index));

        if !sels.is_empty() {
            c.subclass_selectors.extend(sels[..].iter().cloned());
        }

        sel_index = 0;
    }
}
