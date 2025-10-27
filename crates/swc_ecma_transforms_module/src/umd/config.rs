use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::Expr;
use swc_ecma_parser::{parse_file_as_expr, Syntax};

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
                            FileName::Internal(format!("<umd-config-{s}.js>")).into(),
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
