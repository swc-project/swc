use std::collections::HashMap;

use inflector::Inflector;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{errors::HANDLER, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{Expr, Ident};
use swc_ecma_parser::{parse_file_as_expr, Syntax};
use swc_ecma_utils::quote_ident;

use super::super::util;

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub globals: HashMap<String, String>,

    #[serde(flatten, default)]
    pub config: util::Config,
}

impl Config {
    pub(super) fn build(self, cm: Lrc<SourceMap>) -> BuiltConfig {
        BuiltConfig {
            config: self.config,
            globals: self
                .globals
                .into_iter()
                .map(|(k, v)| {
                    let parse = |s| {
                        let fm = cm.new_source_file(
                            FileName::Internal(format!("<umd-config-{}.js>", s)).into(),
                            s,
                        );

                        parse_file_as_expr(
                            &fm,
                            Syntax::default(),
                            Default::default(),
                            None,
                            &mut Vec::new(),
                        )
                        .map_err(|e| {
                            if HANDLER.is_set() {
                                HANDLER.with(|h| e.into_diagnostic(h).emit())
                            }
                        })
                        .unwrap()
                    };
                    (k, parse(v))
                })
                .collect(),
        }
    }
}
#[derive(Clone)]
pub(super) struct BuiltConfig {
    #[allow(dead_code)]
    pub globals: HashMap<String, Box<Expr>>,
    pub config: util::Config,
}

impl BuiltConfig {
    pub fn global_name(&self, src: &str) -> JsWord {
        if !src.contains('/') {
            return src.to_camel_case().into();
        }

        src.split('/').last().unwrap().to_camel_case().into()
    }

    pub fn determine_export_name(&self, filename: Lrc<FileName>) -> Ident {
        match &*filename {
            FileName::Real(ref path) => {
                let s = match path.file_stem() {
                    Some(stem) => self.global_name(&stem.to_string_lossy()),
                    None => self.global_name(&path.display().to_string()),
                };

                quote_ident!(s).into()
            }
            FileName::Custom(s) => {
                let s = self.global_name(s);
                quote_ident!(s).into()
            }
            _ => unimplemented!("determine_export_name({:?})", filename),
        }
    }
}
