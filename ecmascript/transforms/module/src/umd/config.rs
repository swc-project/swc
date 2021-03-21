use super::super::util;
use inflector::Inflector;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::Expr;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::HANDLER;

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
                        let fm = cm
                            .new_source_file(FileName::Custom(format!("<umd-config-{}.js>", s)), s);

                        let lexer = Lexer::new(
                            Syntax::default(),
                            Default::default(),
                            StringInput::from(&*fm),
                            None,
                        );
                        Parser::new_from(lexer)
                            .parse_expr()
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
    pub globals: HashMap<String, Box<Expr>>,
    pub config: util::Config,
}

impl BuiltConfig {
    pub fn global_name(&self, src: &JsWord) -> JsWord {
        if !src.contains('/') {
            return src.to_camel_case().into();
        }

        src.split('/').last().unwrap().to_camel_case().into()
    }
    pub fn determine_export_name(&self, filename: FileName) -> Expr {
        match filename {
            FileName::Real(ref path) => {
                let s = match path.file_stem() {
                    Some(stem) => self.global_name(&stem.to_string_lossy().into()),
                    None => self.global_name(&path.display().to_string().into()),
                };

                Expr::Ident(quote_ident!(s))
            }
            _ => unimplemented!("determine_export_name({:?})", filename),
        }
    }
}
