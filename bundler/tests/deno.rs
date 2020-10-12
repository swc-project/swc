//! In-tree testing for deno integration.
//!
//! This module exists because this is way easier than using copying requires
//! files.

use anyhow::{Context, Error};
use std::collections::HashMap;
use swc_bundler::{Bundler, Load, Resolve};
use swc_common::{sync::Lrc, FileName, SourceFile, SourceMap, Span, GLOBALS};
use swc_ecma_ast::{Expr, Lit, Module, Str};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::typescript::strip;
use swc_ecma_visit::FoldWith;
use url::Url;

#[test]
#[ignore = "Too slow"]
fn oak_6_2_0_application() {
    bundle("https://deno.land/x/oak@v6.2.0/application.ts");
}

#[test]
#[ignore = "Too slow"]
fn oak_6_3_1_mod() {
    bundle("https://deno.land/x/oak@v6.3.1/mod.ts");
}

fn bundle(url: &str) -> Module {
    let result = testing::run_test2(false, |cm, _handler| {
        GLOBALS.with(|globals| {
            let bundler = Bundler::new(
                globals,
                cm.clone(),
                Loader { cm: cm.clone() },
                Resolver,
                swc_bundler::Config {
                    require: false,
                    disable_inliner: true,
                    ..Default::default()
                },
                Box::new(Hook),
            );
            let mut entries = HashMap::new();
            entries.insert("main".to_string(), FileName::Custom(url.to_string()));
            let output = bundler.bundle(entries).unwrap();

            Ok(output.into_iter().next().unwrap().module)
        })
    })
    .unwrap();

    result
}

#[derive(Clone)]
struct Loader {
    cm: Lrc<SourceMap>,
}

impl Load for Loader {
    fn load(&self, file: &FileName) -> Result<(Lrc<SourceFile>, Module), Error> {
        let url = match file {
            FileName::Custom(v) => v,
            _ => unreachable!("this test only uses url"),
        };

        let url = Url::parse(&url).context("failed to parse url")?;
        let resp = reqwest::blocking::get(url.clone())
            .with_context(|| format!("failed to fetch `{}`", url))?;

        let bytes = resp
            .bytes()
            .with_context(|| format!("failed to read data from `{}`", url))?;

        let src = String::from_utf8_lossy(&bytes);
        let fm = self
            .cm
            .new_source_file(FileName::Custom(url.to_string()), src.to_string());

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                decorators: true,
                ..Default::default()
            }),
            JscTarget::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_typescript_module().unwrap();
        let module = module.fold_with(&mut strip());

        Ok((fm, module))
    }
}

#[derive(Debug, Clone, Copy)]
struct Resolver;

impl Resolve for Resolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        let base_url = match base {
            FileName::Custom(v) => v,
            _ => unreachable!("this test only uses url"),
        };
        let base_url = Url::parse(&base_url).context("failed to parse url")?;

        let options = Url::options();
        let base_url = options.base_url(Some(&base_url));
        let url = base_url
            .parse(module_specifier)
            .with_context(|| format!("failed to resolve `{}`", module_specifier))?;

        return Ok(FileName::Custom(url.to_string()));
    }
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_url(&self, span: Span, file: &FileName) -> Result<Option<Expr>, Error> {
        Ok(Some(Expr::Lit(Lit::Str(Str {
            span,
            value: file.to_string().into(),
            has_escape: false,
        }))))
    }
}
