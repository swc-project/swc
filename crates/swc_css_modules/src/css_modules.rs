use std::{
    collections::{hash_map::DefaultHasher, HashSet},
    hash::{Hash, Hasher},
    path::Path,
};

use swc_atoms::JsWord;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, CompoundSelector, PseudoClassSelector,
    PseudoClassSelectorChildren, SelectorList, SubclassSelector,
};
use swc_css_visit::Fold;

#[derive(Default)]
pub struct CssModuleComponent {
    pub class_collect: HashSet<String>,
    pub group_pseudo_ident: Vec<Vec<String>>,
    pub prefix_filepath: String,
}

impl CssModuleComponent {
    ///
    /// init css-module context
    pub fn new(filepath: &str) -> Self {
        CssModuleComponent {
            class_collect: Default::default(),
            group_pseudo_ident: vec![],
            prefix_filepath: filepath.to_string(),
        }
    }

    ///
    /// Generated content_hash from article content
    pub fn generate_hash_by_content(&self, content: &str) -> String {
        let path = Path::new(self.prefix_filepath.as_str());
        let mut prefix = "".to_string();
        if let Some(parent_path) = path.parent() {
            if let Some(parent_dir) = parent_path.file_name() {
                prefix += parent_dir.to_str().unwrap();
                prefix += "_";
            }
        }
        prefix += path
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
            .replace('.', "_")
            .replace(r#"\\"#, "/")
            .as_str();
        let mut hasher = DefaultHasher::new();
        content.hash(&mut hasher);
        let content_hash = hasher.finish().to_string();
        format!(
            "{}_{}_{}",
            prefix,
            content_hash,
            content.to_string().replace(r#"\\"#, "---")
        )
    }

    ///
    /// clear self complex_selector
    pub fn clear_group_pseudo_ident(&mut self) {
        self.group_pseudo_ident.clear();
    }

    ///
    /// init ident group
    /// :local is default ident for each complex_selector
    pub fn add_group_pseudo_ident(&mut self) {
        self.group_pseudo_ident.push(vec![":local".to_string()]);
    }

    ///
    /// insert :local :global
    /// enusure ident number for each complex_selector is right
    /// example: vec[ vec[:global,:local],vec[:global,:local]  ]
    pub fn insert_ident(&mut self, index: usize, value: &str) {
        let list = self.group_pseudo_ident.get_mut(index).unwrap();
        if Some(&value.to_string()) != list.last() {
            list.push(value.to_string());
        }
    }

    pub fn get_ident(&self, index: usize) -> bool {
        let list = self.group_pseudo_ident.get(index).unwrap();
        Some(&":global".to_string()) == list.last()
    }

    pub fn convert_pseudo_global_class(
        &self,
        pseudo_class: PseudoClassSelector,
    ) -> Vec<ComplexSelectorChildren> {
        let mut list = vec![];
        for (index, item) in pseudo_class.children.unwrap().into_iter().enumerate() {
            if index > 0 {
                // todo fix error
            } else {
                // handle logic limit len = 1
                if let PseudoClassSelectorChildren::SelectorList(select_list) = item {
                    for (index, mut select_children_list) in
                        select_list.children.into_iter().enumerate()
                    {
                        if index > 0 {
                            // todo fix error
                        } else {
                            // handle logic limit len = 1
                            list.append(&mut select_children_list.children)
                        }
                    }
                } else {
                    // todo fix error
                }
            }
        }
        list
    }

    pub fn convert_pseudo_local_class(
        &mut self,
        pseudo_class: PseudoClassSelector,
    ) -> Vec<ComplexSelectorChildren> {
        let mut list = vec![];
        for (index, item) in pseudo_class.children.unwrap().into_iter().enumerate() {
            if index > 0 {
                // todo fix error
            } else {
                // handle logic limit len = 1
                if let PseudoClassSelectorChildren::SelectorList(select_list) = item {
                    for (index, mut select_children_list) in
                        select_list.children.into_iter().enumerate()
                    {
                        if index > 0 {
                            // todo fix error
                        } else {
                            // handle logic limit len = 1
                            for complex_selector_children in
                                select_children_list.children.iter_mut()
                            {
                                if let ComplexSelectorChildren::CompoundSelector(
                                    compound_selector,
                                ) = complex_selector_children
                                {
                                    for selector in compound_selector.subclass_selectors.iter_mut()
                                    {
                                        if let SubclassSelector::Class(class) = selector {
                                            //match :local need transform
                                            let class_selector_txt_value = self
                                                .generate_hash_by_content(
                                                    class.text.raw.to_string().as_str(),
                                                );
                                            class.text.raw =
                                                JsWord::from(class_selector_txt_value.as_str());
                                            self.class_collect.insert(class_selector_txt_value);
                                        } else if let SubclassSelector::Id(id) = selector {
                                            //match :local need transform
                                            let id_selector_txt_value = self
                                                .generate_hash_by_content(
                                                    id.text.raw.to_string().as_str(),
                                                );
                                            id.text.raw =
                                                JsWord::from(id_selector_txt_value.as_str());
                                            self.class_collect.insert(id_selector_txt_value);
                                        }
                                    }
                                }
                            }
                            list.append(&mut select_children_list.children)
                        }
                    }
                } else {
                    // todo fix error
                }
            }
        }
        list
    }
}

impl Fold for CssModuleComponent {
    ///
    /// fold_selector_list
    /// example:
    /// h2 .m :global(.tap #h2) ->
    /// h2 .m .top #h2
    fn fold_selector_list(&mut self, n: SelectorList) -> SelectorList {
        let mut list = vec![];
        self.clear_group_pseudo_ident();

        for (index, mut complex_selector) in n.children.into_iter().enumerate() {
            // compare every group pseudo is matched
            self.add_group_pseudo_ident();
            let mut complex_selector_children_list = vec![];

            let mut z_index = 0;
            while z_index < complex_selector.children.len() {
                let complex_selector_children = complex_selector.children.remove(index);
                match complex_selector_children {
                    ComplexSelectorChildren::CompoundSelector(compound_selector) => {
                        let mut new_compound_selector = CompoundSelector {
                            subclass_selectors: vec![],
                            ..compound_selector
                        };
                        let mut sub_list = vec![];
                        for sub in compound_selector.subclass_selectors.into_iter() {
                            match sub {
                                SubclassSelector::Id(mut id) => {
                                    if !self.get_ident(index) {
                                        //match :local need transform
                                        let id_selector_txt_value = self.generate_hash_by_content(
                                            id.text.raw.to_string().as_str(),
                                        );
                                        id.text.raw = JsWord::from(id_selector_txt_value.as_str());
                                        self.class_collect.insert(id_selector_txt_value);
                                    }
                                    sub_list.push(SubclassSelector::Id(id));
                                }
                                SubclassSelector::Class(mut class) => {
                                    if !self.get_ident(index) {
                                        //match :local need transform
                                        let class_selector_txt_value = self
                                            .generate_hash_by_content(
                                                class.text.raw.to_string().as_str(),
                                            );
                                        class.text.raw =
                                            JsWord::from(class_selector_txt_value.as_str());
                                        self.class_collect.insert(class_selector_txt_value);
                                    }
                                    sub_list.push(SubclassSelector::Class(class));
                                }
                                SubclassSelector::Attribute(_) => {
                                    sub_list.push(sub);
                                }
                                SubclassSelector::PseudoClass(pseudo_class) => {
                                    if pseudo_class.name.value.to_string() == "global" {
                                        if pseudo_class.children.is_none() {
                                            // example: -> :global .x
                                            self.insert_ident(index, ":global");
                                        } else {
                                            // example: -> :global(.x h2)
                                            let mut target_list =
                                                self.convert_pseudo_global_class(pseudo_class);
                                            complex_selector_children_list.append(&mut target_list);
                                            continue;
                                        }
                                    } else if pseudo_class.name.value.to_string() == "local" {
                                        if pseudo_class.children.is_none() {
                                            // example: -> :local .x
                                            self.insert_ident(index, ":local");
                                        } else {
                                            // example: -> :local(.x h2)
                                            let mut target_list =
                                                self.convert_pseudo_local_class(pseudo_class);
                                            let mut index = 0;
                                            while index < target_list.len() {
                                                let target_complex_selector_children =
                                                    target_list.remove(index);
                                                if index == 0 {
                                                    match target_complex_selector_children {
                            ComplexSelectorChildren::CompoundSelector(mut ts) => {
                              if let Some(type_selector) = ts.type_selector {
                                if !sub_list.is_empty() && new_compound_selector.type_selector.is_none() {
                                  let sub_last = sub_list.last_mut().unwrap();
                                  if let SubclassSelector::Id(id) = sub_last {} else if let SubclassSelector::Class(class) = sub_last {}
                                } else if new_compound_selector.type_selector.is_some() {}
                              } else {
                                sub_list.append(&mut ts.subclass_selectors);
                                new_compound_selector.subclass_selectors = sub_list;
                                complex_selector_children_list.push(ComplexSelectorChildren::CompoundSelector(new_compound_selector));
                                sub_list = vec![];
                                new_compound_selector = CompoundSelector {
                                  span: Default::default(),
                                  nesting_selector: None,
                                  type_selector: None,
                                  subclass_selectors: vec![],
                                }
                              }
                            }
                            ComplexSelectorChildren::Combinator(tc) => {
                              // match :local(> h2) :local(> .a)
                              if new_compound_selector.type_selector.is_some() || !sub_list.is_empty() {
                                new_compound_selector.subclass_selectors = sub_list;
                                complex_selector_children_list.push(ComplexSelectorChildren::CompoundSelector(new_compound_selector));
                                complex_selector_children_list.push(ComplexSelectorChildren::Combinator(tc));
                              }
                              sub_list = vec![];
                              new_compound_selector = CompoundSelector {
                                span: Default::default(),
                                nesting_selector: None,
                                type_selector: None,
                                subclass_selectors: vec![],
                              }
                            }
                          }
                                                } else {
                                                    complex_selector_children_list
                                                        .push(target_complex_selector_children);
                                                }
                                                index += 1;
                                            }
                                        }
                                    } else {
                                        sub_list.push(SubclassSelector::PseudoClass(pseudo_class));
                                    }
                                }
                                SubclassSelector::PseudoElement(_) => {
                                    sub_list.push(sub);
                                }
                            }
                        }
                        if !sub_list.is_empty() || new_compound_selector.type_selector.is_some() {
                            new_compound_selector.subclass_selectors = sub_list;
                            complex_selector_children_list.push(
                                ComplexSelectorChildren::CompoundSelector(new_compound_selector),
                            );
                        }
                    }
                    ComplexSelectorChildren::Combinator(combinator) => {
                        complex_selector_children_list
                            .push(ComplexSelectorChildren::Combinator(combinator))
                    }
                }
                z_index += 1;
            }

            // insert group select_txt with ','

            list.push(ComplexSelector {
                children: complex_selector_children_list,
                ..complex_selector
            });
        }

        SelectorList {
            children: list,
            ..n
        }
    }
}
