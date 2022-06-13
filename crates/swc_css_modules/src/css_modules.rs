use std::collections::HashSet;

use swc_atoms::JsWord;
use swc_common::{input::SourceFileInput, sync::Lrc, FileName, SourceMap};
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, CompoundSelector, PseudoClassSelectorChildren,
    SelectorList, SubclassSelector, Token, TokenAndSpan,
};
use swc_css_parser::{
    lexer::Lexer,
    parser::{Parser, ParserConfig},
};
use swc_css_visit::{Fold, FoldWith};

use crate::hash::StyleHash;

#[derive(Default)]
pub struct CssModuleComponent {
    pub hash_prefix: String,
    pub class_collect: HashSet<String>,
    pub group_pseudo_ident: Vec<Vec<String>>,
}

#[derive(Default)]
pub struct ChildCssModuleComponent {
    pub selector_list: Option<SelectorList>,
}

impl CssModuleComponent {
    ///
    /// init css-module context
    pub fn new(filepath: &str, content: &str) -> Self {
        CssModuleComponent {
            hash_prefix: StyleHash::generate_css_module_hash(filepath, content),
            class_collect: Default::default(),
            group_pseudo_ident: vec![],
        }
    }

    pub fn convert_token_and_span(t: TokenAndSpan) -> Result<String, String> {
        let res: String;
        if let Token::Ident { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::Hash { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::AtKeyword { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::WhiteSpace { value } = t.token {
            res = value.to_string();
        } else if let Token::Number { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::Percentage { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::Url { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::String { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::BadString { value, .. } = t.token {
            res = value.to_string();
        } else if let Token::Delim { value, .. } = t.token {
            res = value.to_string();
        } else {
            return Err("convert token has no matching correct type".to_string());
        }
        if !res.is_empty() {
            Ok(res)
        } else {
            Err("convert token has error".to_string())
        }
    }

    pub fn child_select_compile(select_txt: &str) -> ComplexSelector {
        let content = select_txt.to_string() + "{" + "}";
        let config = ParserConfig {
            ..Default::default()
        };
        let cm: Lrc<SourceMap> = Default::default();
        let fm = cm.new_source_file(FileName::Custom("/root/index.css".to_string()), content);
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);
        let stylesheet = parser.parse_all().unwrap();
        let mut visitor = ChildCssModuleComponent {
            selector_list: None,
        };
        stylesheet.fold_with(&mut visitor);
        let selector_list = visitor.selector_list.unwrap();
        selector_list.children.get(0).unwrap().to_owned()
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

    pub fn convert_vec_pseudoclasschildren(
        list: Vec<PseudoClassSelectorChildren>,
    ) -> ComplexSelector {
        let mut child_select_txt = "".to_string();
        for item in list.into_iter() {
            if let PseudoClassSelectorChildren::PreservedToken(t) = item {
                if !matches!(t.token, Token::Comma) {
                    child_select_txt += Self::convert_token_and_span(t).unwrap().as_str();
                }
            }
        }
        Self::child_select_compile(child_select_txt.as_str())
    }
}

impl Fold for ChildCssModuleComponent {
    fn fold_selector_list(&mut self, n: SelectorList) -> SelectorList {
        self.selector_list = Some(n);
        SelectorList {
            span: Default::default(),
            children: vec![],
        }
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

        for (index, complex_selector) in n.children.into_iter().enumerate() {
            // compare every group pseduo is matched
            self.add_group_pseudo_ident();
            let mut complex_selector_children_list = vec![];

            for complex_selector_children in complex_selector.children.into_iter() {
                match complex_selector_children {
                    ComplexSelectorChildren::CompoundSelector(compound_selector) => {
                        if !compound_selector.subclass_selectors.is_empty() {
                            // css_modules logic here
                            let mut sub_list = vec![];
                            for sub_ss in compound_selector.subclass_selectors.into_iter() {
                                match sub_ss {
                                    SubclassSelector::Id(_)
                                    | SubclassSelector::Attribute(_)
                                    | SubclassSelector::PseudoElement(_) => {
                                        sub_list.push(sub_ss);
                                    }
                                    SubclassSelector::Class(mut class) => {
                                        if !self.get_ident(index) {
                                            //match :local need transform
                                            let mut class_selector_txt_value: String =
                                                class.text.value.to_string();
                                            class_selector_txt_value = self.hash_prefix.clone()
                                                + "_"
                                                + class_selector_txt_value.as_str();
                                            class.text.raw =
                                                JsWord::from(class_selector_txt_value.as_str());
                                            self.class_collect.insert(class_selector_txt_value);
                                        }
                                        sub_list.push(SubclassSelector::Class(class));
                                    }
                                    SubclassSelector::PseudoClass(prseudo_class) => {
                                        if prseudo_class.name.value.to_string() == "global" {
                                            if prseudo_class.children.is_none() {
                                                // example: -> :global .x
                                                self.insert_ident(index, ":global");
                                            } else {
                                                // example: -> :global(.x h2)
                                                let mut child_stylesheet =
                                                    Self::convert_vec_pseudoclasschildren(
                                                        prseudo_class.children.unwrap(),
                                                    );
                                                complex_selector_children_list
                                                    .append(&mut child_stylesheet.children);
                                                break;
                                            }
                                        } else if prseudo_class.name.value.to_string() == "local" {
                                            if prseudo_class.children.is_none() {
                                                // example: -> :local .x
                                                self.insert_ident(index, ":local");
                                            } else {
                                                // example: -> :local(.x h2)
                                                let mut child_stylesheet =
                                                    Self::convert_vec_pseudoclasschildren(
                                                        prseudo_class.children.unwrap(),
                                                    );
                                                // :local(.x h2) -> convert .x -> .hash_x
                                                for child_complex_selector_children in
                                                    child_stylesheet.children.iter_mut()
                                                {
                                                    if let ComplexSelectorChildren::CompoundSelector(child_compound_selector) = child_complex_selector_children {
                            for child in child_compound_selector.subclass_selectors.iter_mut() {
                              if let SubclassSelector::Class(child_class) = child {
                                let mut class_selector_txt_value: String = child_class.text.value.to_string();
                                class_selector_txt_value = self.hash_prefix.clone() + "_" + class_selector_txt_value.as_str();
                                child_class.text.raw = JsWord::from(class_selector_txt_value.as_str());
                                self.class_collect.insert(class_selector_txt_value);
                              }
                            }
                          }
                                                }
                                                complex_selector_children_list
                                                    .append(&mut child_stylesheet.children);
                                                break;
                                            }
                                        } else {
                                            sub_list
                                                .push(SubclassSelector::PseudoClass(prseudo_class));
                                        }
                                    }
                                }
                            }
                            complex_selector_children_list.push(
                                ComplexSelectorChildren::CompoundSelector(CompoundSelector {
                                    subclass_selectors: sub_list,
                                    ..compound_selector
                                }),
                            );
                        } else {
                            complex_selector_children_list
                                .push(ComplexSelectorChildren::CompoundSelector(compound_selector));
                        }
                    }
                    ComplexSelectorChildren::Combinator(_) => {
                        complex_selector_children_list.push(complex_selector_children);
                    }
                }
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
