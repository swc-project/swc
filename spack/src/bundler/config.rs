use crate::Bundler;
use anyhow::{Error, Result};
use dashmap::DashMap;
use std::{collections::HashMap, env};
use swc_atoms::JsWord;
use swc_common::FileName;
use swc_ecma_ast::Expr;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};

#[derive(Debug, Default)]
pub(super) struct Cache {
    exprs: DashMap<String, Expr>,
}

impl Bundler<'_> {
    #[inline]
    fn get_or_parse_expr(&self, key: &str, s: String) -> Result<Expr> {
        if let Some(v) = self.cache.exprs.get(key) {
            return Ok((*v).clone());
        }

        let cm = self.swc.cm.clone();
        let fm = cm.new_source_file(FileName::Anon, s);

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let expr = parser.parse_expr().map_err(|err| {
            Error::msg(format!(
                "config: failed parse `{}` as expression: (key = `{}`): {:?}",
                fm.src, key, err
            ))
        })?;

        self.cache.exprs.insert(key.to_string(), *expr.clone());

        Ok(*expr)
    }

    /// Has`NODE_ENV`
    pub(super) fn envs(&self) -> Result<HashMap<JsWord, Expr>> {
        let mut envs = HashMap::with_capacity(1);

        let node_env = env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string());

        let v = self.get_or_parse_expr("NODE_ENV", node_env)?;
        envs.insert("NODE_ENV".into(), v);

        Ok(envs)
    }
}
