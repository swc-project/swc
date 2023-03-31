use std::collections::HashMap;

use inflector::Inflector;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_cached::regex::CachedRegex;
use swc_common::FileName;
use swc_ecma_ast::Ident;
use swc_ecma_utils::quote_ident;

use super::super::util;

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub globals: Option<HashMap<String, String>>,

    #[serde(default)]
    pub exact_globals: Option<Vec<(String, String)>>,

    #[serde(flatten, default)]
    pub config: util::Config,
}

fn reduce_src(src: &JsWord) -> JsWord {
    let mut out = src.clone();

    let js_ext_regex = CachedRegex::new(r#"\.([cm]?[jt]s|[jt]sx)$"#).unwrap();

    if out.contains('/') {
        out = out.split('/').last().unwrap().into();
    }

    out = JsWord::from(js_ext_regex.replace(&out, ""));

    out = out.to_camel_case().into();
    if (out).eq("") {
        out = JsWord::from("_");
    }
    out
}

impl Config {
    pub(super) fn build(self) -> BuiltConfig {
        BuiltConfig {
            config: self.config,
            exact_globals: self.exact_globals.as_ref().map(|globals| {
                globals
                    .iter()
                    .filter_map(|(glb_matcher, glb_map)| {
                        let regex = CachedRegex::new(glb_matcher);
                        match regex {
                            Ok(reg) => Some((reg, glb_map.to_string())),
                            _ => None,
                        }
                    })
                    .collect()
            }),
            globals: self.globals.map(|globals| {
                globals
                    .iter()
                    .map(|(glb_matcher, glb_map)| {
                        let reduced_matcher =
                            reduce_src(&JsWord::from(glb_matcher.as_str())).to_string();
                        (reduced_matcher, glb_map.to_string())
                    })
                    .collect()
            }),
        }
    }
}
#[derive(Clone)]
pub(super) struct BuiltConfig {
    #[allow(dead_code)]
    pub globals: Option<HashMap<String, String>>,
    pub exact_globals: Option<Vec<(CachedRegex, String)>>,
    pub config: util::Config,
}

impl BuiltConfig {
    pub fn global_name(&self, src: &JsWord) -> JsWord {
        if let Some(globals) = &self.exact_globals {
            let matched_mapped_global = globals.iter().find_map(|(regex, map_str)| {
                if regex.is_match(src) {
                    return Some(map_str);
                }
                None
            });

            if let Some(matched) = matched_mapped_global {
                return JsWord::from(matched.as_str());
            }

            return reduce_src(src);
        }

        let mapped_src: JsWord = reduce_src(src);

        if let Some(globals) = &self.globals {
            if globals.contains_key(&mapped_src.to_string()) {
                let mapped_global = globals.get(&mapped_src.to_string()).unwrap();
                return JsWord::from(mapped_global.as_str());
            }
        }

        mapped_src
    }

    pub fn determine_export_name(&self, filename: FileName) -> Ident {
        match filename {
            FileName::Real(ref path) => {
                let s = match path.file_stem() {
                    Some(stem) => self.global_name(&stem.to_string_lossy().into()),
                    None => self.global_name(&path.display().to_string().into()),
                };

                quote_ident!(s)
            }
            FileName::Custom(s) => {
                let s = self.global_name(&s.into());
                quote_ident!(s)
            }
            _ => unimplemented!("determine_export_name({:?})", filename),
        }
    }
}
